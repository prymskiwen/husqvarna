<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Enums\UserType;
use App\Models\Order;
use App\Models\Product;
use App\Models\Api;
use App\Models\AlertReceiver;

use KubAT\PhpSimple\HtmlDomParser;

class ApiManageController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */    

    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */

    public function index(Request $request){
        if( Auth::user()->user_type >= UserType::Superadmin ){
            $apis = Api::get();
            $data = array('apis');
            return view('api.index', compact($data));            
        }
    }
    public function ajax_get_apis(Request $request){
        $apis = array();
        $array = Api::get()->toArray();
        foreach ($array as $key => $api) {
            $elem = array();
            array_push($elem, $api['id']);
            array_push($elem, $api['status']);
            array_push($elem, $api['alert_email']);
            array_push($elem, $api['alert_tel']);
            array_push($elem, $api['alert_sms']);

            $receivers = AlertReceiver::where('api_id', $api['id'])->get()->toArray();
            array_push($elem, $receivers);

            array_push($elem, $api['api_name']);
            array_push($apis, $elem);
        }

        $result = array();
        $searchText = "";
        if($request->input()['search']['value']) $searchText = $request->input()['search']['value'];
        if($searchText){
            foreach ($apis as $key => $api) {
                if(strpos($api['6'], $searchText)!==false)
                    array_push($result, $api);
            }
        }else $result = $apis;
        $response = array(
            'data' => $result,
            'draw' => $request->input()['draw'],
            'recordsFiltered' => count($result),
            'recordsTotal' => count($apis)
        );
        
        return response()->json($response);
    }
    public function updateApiAlert(Request $request){
        $alert = $request->alert;
        $api_id = $request->api_id;
        Api::where('id', $api_id)->update(array('alert'=>$alert));
        $response = array('success' => true , 'msg' => 'API????????????????????????????????????????????????' );

        return response()->json($response);
    }
    public function updateApiVia(Request $request){
        $via = $request->via;
        $api_id = $request->api_id;
        Api::where('id', $api_id)->update(array('via'=>$via));
        $response = array('success' => true , 'msg' => '????????????????????????????????????' );

        return response()->json($response);
    }
    public function addApiReceiver(Request $request){
        $receiver = $request->receiver;
        $receiver_id = $request->receiver_id;
        $alert_type = $request->alert_type;
        $api_id = $request->api_id;
        if($receiver_id!=0){
            AlertReceiver::where('id', $receiver_id)->update(array('receiver'=>$receiver));
            $receiver = AlertReceiver::where('id', $receiver_id)->get()->first();
            $response = array('success' => true , 'msg' => '', 'receiver_id'=>$receiver->id);
        }else{
            $receiver = AlertReceiver::create(array(
                'api_id'=>$api_id,
                'receiver'=>$receiver,
                'type'=>$alert_type
            ));
            $response = array('success' => true , 'msg' => '??????????????????????????????????????????', 'receiver_id'=>$receiver->id);
        }

        return response()->json($response);
    }
    public function deleteApiReceiver(Request $request){
        $receiver_id = $request->receiver_id;
        $api_id = $request->api_id;
        $receiver = AlertReceiver::where('api_id', $api_id)->where('id', $receiver_id);
        if($receiver){
            $receiver->delete();
            $response = array('success' => true , 'msg' => '' );
        }else{
            $response = array('success' => false , 'msg' => '' );
        }
        return response()->json($response);
    }
    public function updateAlertType(Request $request){
        $api_id = $request->api_id;
        $alert_type = $request->alert_type;
        $alert = $request->alert;
        Api::where('id', $api_id)->update(array($alert_type=>$alert));
        $response = array('success' => true , 'msg' => '' );
        return response()->json($response);
    }
    function checkEmail($email) {
        $find1 = strpos($email, '@');
        $find2 = strpos($email, '.');
        return ($find1 !== false && $find2 !== false && $find2 > $find1);
    }
    public function apis(Request $request){
        if( Auth::user()->user_type >= UserType::Superadmin ){
            $data = array();
            return view('api.apis', compact($data));            
        }
    }
    public function api_detail(Request $request){
        if( Auth::user()->user_type >= UserType::Superadmin ){
            $id = $request->id;
            $api = Api::where('id', $id)->get()->first();
            $data = array('api');
            return view('api.api_detail', compact($data));  
        }
    }
}