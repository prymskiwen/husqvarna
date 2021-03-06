<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\Product;
use App\Imports\OrderImport;
use App\Imports\ProductImport;
use KubAT\PhpSimple\HtmlDomParser;
use App\Models\Api;
use App\Models\AlertReceiver;
use Excel;
use DateTime;

class ApiController extends Controller
{
    public function uploadOrder(Request $request){   
        
        if(isset($request->isApiCheck) && $request->isApiCheck) // isApiCheck param is for API checking flag
            return "success";
        else 
            return response()->json( $this->readcsv($request, new OrderImport(strtolower($request->input('status'))), 'po_csv') );        
    }

    public function uploadProduct(Request $request){       	
        
        if(isset($request->isApiCheck) && $request->isApiCheck) // isApiCheck param is for API checking flag
            return "success";
        else 
            return response()->json( $this->readcsv($request, new ProductImport($request->input('order_id')), 'po_detail') );
    }

    public function updatePoStatus(Request $request){       	        
        
        if(isset($request->isApiCheck) && $request->isApiCheck) // isApiCheck param is for API checking flag
            return "success";
        else 
            return response()->json( Order::updateStatus($request->input('order_id'), $request->input('status')) );
    }

    public static function readcsv($request, $import, $upload_path){
    	//if ($request->input('submit') != null) {
            $file = $request->file('file');

            if($file){
                // File Details
                $filename  = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $tempPath  = $file->getRealPath();
                $fileSize  = $file->getSize();
                $mimeType  = $file->getMimeType();

                // Valid File Extensions
                $valid_extension = array("csv","xls","xlsx");

                // 2MB in Bytes
                $maxFileSize = 2097152;

                // Check file extension
                if (in_array(strtolower($extension), $valid_extension)) {

                    // Check file size
                    if ($fileSize <= $maxFileSize) {

                        // File upload location
                     	$location = public_path('uploads/'.$upload_path);

                        $filepath = $location . "/" . $filename;

                        if(file_exists($filepath)) unlink($filepath);
                        // Upload file
                        $file->move($location, $filename);
                        
                        Excel::import($import, $filepath); 

                        //Session::flash('message', '???????????????????????????????????????');
                        $result=array('success' => true, 'msg' =>'???????????????????????????????????????' );
                    } else {
                        //Session::flash('message', '????????????????????????????????? ???????????????2MB???????????????????????????????????????');
                        $result=array('success' => false, 'msg' =>'????????????????????????????????? ???????????????2MB???????????????????????????????????????' );
                    }

                } else {
                    //Session::flash('message', '?????????????????????????????????');
                    $result=array('success' => false, 'msg' =>'?????????????????????????????????' );
                }
            }else{

                //Session::flash('message', '?????????????????????????????????????????????????????????');
                $result=array('success' => false, 'msg' =>'?????????????????????????????????????????????????????????' );
            }    
        //}

        // Redirect to index
        //return redirect(route('management.csv_import'));
        return $result;
    }


    public static function checkTrackingStatus(Request $request){

        if($request->check=="all"){
            $data_res = Order::get();
        }else{
            $data_res = Order::where('ordered_on', '>', date('Y/m/d', strtotime('-3 days')))->get();    
        }
        
        
        $data =[];

        foreach($data_res as $key=>$value){
            array_push($data, array_values( json_decode(json_encode($value), true)) );
        }

        $count = 0;
        $temp_key=0;
        $tracking_data = "";
        $send = false;
        $temp_tracking_data = "";
        $kk=0;
        foreach ($data as $key => $order) {
            $send = false;
            $kk = $key;
            if($order[12]){
                $order_tracking = explode(",", $order[12]);
            
                if( ($count + count($order_tracking)) >10 ){
                    $send =true;
                    $count = 0;

                    if($order[12]!=""){
                        foreach ($order_tracking as $k => $ot) {
                            $count ++;
                            $temp_tracking_data .= "&main:no".($count)."=".$ot;    
                        }    
                        $kk = $kk-1;            
                    }                                    
                    
                }else{
                    if($order[12]!=""){
                        $tracking_data .= $temp_tracking_data;
                        foreach ($order_tracking as $k => $ot) {
                            $count ++;
                            $tracking_data .= "&main:no".($count)."=".$ot;    
                        }                                        
                    }   

                    $temp_tracking_data = "";

                    if($count==10){   
                        $count =0;                     
                        $send = true;                        
                    }                              
                }
                
            }           


            if( $send == true || $key>=(count($data)-1) ){               
                $res = array();

                if($tracking_data != ""){                    
                    $curl = curl_init();

                    $query = "jsf_tree_64=".urlencode( env("SAGAWA_JSF_TREE_64", "") )."&jsf_state_64=".urlencode( env("SAGAWA_JSF_STATE_64", "") ) . "&jsf_viewid=".urlencode('/web/okurijosearcheng.jsp')."&main:correlation=1&main:toiStart=".urlencode('Track it')."&main_SUBMIT=1" . $tracking_data;    
                    
                    curl_setopt_array($curl, array(
                        CURLOPT_URL => "https://k2k.sagawa-exp.co.jp/p/sagawa/web/okurijosearcheng.jsp",            
                        CURLOPT_RETURNTRANSFER => true,
                        CURLOPT_ENCODING => "",
                        CURLOPT_MAXREDIRS => 10,
                        CURLOPT_TIMEOUT => 0,
                        CURLOPT_FOLLOWLOCATION => true,
                        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                        CURLOPT_CUSTOMREQUEST => "POST",
                        CURLOPT_SSL_VERIFYPEER => false,
                        CURLOPT_POSTFIELDS => $query,
                        CURLOPT_HTTPHEADER => array(
                            "Content-Type: application/x-www-form-urlencoded; charset=UTF-8",
                            'Content-Length: ' . strlen( $query )        
                        ),
                    ));

                    $response = curl_exec($curl);

                    curl_close($curl);                     
                    if($response){ 
                        $dom = HtmlDomParser::str_get_html( $response );                        

                        for ($i=1; $i <=10 ; $i++) { 
                            $tracking_no = $dom->find("input[name='main:no".$i."']");
                            $tracking_date = $dom->find("input[name='main:h-date".$i."']");
                            $tracking_status = $dom->find("input[name='main:h-status".$i."']");    
                            if($tracking_no){
                                $res[] = [$tracking_no[0]->value, date("Y/m/d", strtotime($tracking_date[0]->value)),  $tracking_status[0]->value];    
                            }                            
                        }  

                        $q=0;

                        for($j=$temp_key; $j<=$kk; $j++){
                            $q_data = explode(',', $data[$j][12]);
                            
                            if($data[$j][12]){
                                $tracking_status = [];
                                foreach ($q_data as $v => $qv) {                                    
                                    //if($q<10){
                                        if(count($res[$q])>0){
                                            $status = explode(':', $res[$q][2]);
                                            if( $status[0] =="Not picked up"){
                                                $tracking_status[] = '???????????????';
                                            }else if( $status[0] =="On vehicle for delivery"){
                                                $tracking_status[] = '?????????';
                                            }else if( $status[0] =="Delivered"){
                                                $tracking_status[] = '????????????<br>' . $res[$q][1];
                                            }else if( $status[0] =="Exception"){
                                                $tracking_status[] = '???????????? <br>' . $res[$q][1];
                                            }else{
                                                $tracking_status[] = '????????????';    
                                            }  
                                        }    
                                    //}                                    
                                    $q++;
                                }   
                                $data[$j][2]=implode(',', $tracking_status); 
                            }
                        }    
                    }           
                    
                    $tracking_data ="";
                    $temp_key= $kk+1;  
                }   
            }            

        }   

        foreach ($data as $key => $order) {            
            Order::where('po', $order[3])->update(array('delivery_status' => $order[2]));
        }       

        return "success";
    }

    function checkEmail($email) {
        $find1 = strpos($email, '@');
        $find2 = strpos($email, '.');
        return ($find1 !== false && $find2 !== false && $find2 > $find1);
    }
    public function checkApis(Request $request){
        $res_success = true;
        $res_msgs = array();
        $apis = Api::get()->toArray();
        foreach ($apis as $api) {
            $statusChanged = 0;
            $receivers = AlertReceiver::where('api_id', $api['id'])->get()->toArray();
            switch($api['api_name']){
                case "Amazon Vendor Central PO Collector":
                    $client = new \GuzzleHttp\Client();
                    $url = "https://hzg-amz.jp/api/importPoList";
                    //$url = "http://dev.husqvarna.com/api/importPoList";
                    $query = array(
                        '_token'=>'Jll7q0BSijLOrzaOSm5Dr5hW9cJRZAJKOzvDlxjKCXepwAeZ7JR6YP5zQqnw',
                        'file'=>null,
                        'isApiCheck'=>true
                    );
                    $response = $client->request($api['method'], $url, [
                        'form_params'=>$query
                    ]);
                    $response = $response->getBody()->getContents();
                    $status = "";
                    $api_status = Api::where('id', $api['id'])->get()->first()->status;
                    if($response=="success"){
                        date_default_timezone_set('Asia/Tokyo');
                        $today = date('Y/m/d');
                        $newOrders = Order::where('ordered_on', $today)->get();
                        if(count($newOrders)){
                            $status = "on";
                            if($status!==$api_status) $statusChanged = 1;
                            Api::where('id', $api['id'])->update(array('status'=>'on'));
                        }else{
                            $status = "down";
                            if($status!==$api_status) $statusChanged = 1;
                            Api::where('id', $api['id'])->update(array('status'=>'down'));
                            $res_success = false;
                            array_push($res_msgs, 'Amazon Vendor Central PO Collector API is not working.');
                        }
                    }else{
                        $status = "down";
                        if($status!==$api_status) $statusChanged = 1;
                        Api::where('id', $api['id'])->update(array('status'=>'down'));
                        $res_success = false;
                        array_push($res_msgs, "Amazon Vendor Central PO Collector API is not working.");
                    }
                    if($api['alert_email']==1 && $statusChanged){
                        foreach ($receivers as $receiver) {
                            if($receiver['type']=="email" && $this->checkEmail($receiver['receiver'])){
                                $param = array(
                                    'to'=>$receiver['receiver'],
                                    'subject'=>"Check API status",
                                    'api_name'=>$api['api_name'],
                                    'status'=>$status
                                );
                                $this->sendEmail("api_validation", $param);
                            }
                        }
                        $testparam = array(
                            'to'=>'ai@jts.ec',
                            'subject'=>"Check API status",
                            'api_name'=>$api['api_name'],
                            'status'=>$status
                        );
                        $this->sendEmail("api_validation", $testparam);
                    }
                    break;
                case "Amazon Vendor Central PO Detail Collector":
                    $client = new \GuzzleHttp\Client();
                    $url = "https://hzg-amz.jp/api/importPoDetail";
                    //$url = "http://dev.husqvarna.com/api/importPoDetail";
                    $query = array(
                        '_token'=>'Jll7q0BSijLOrzaOSm5Dr5hW9cJRZAJKOzvDlxjKCXepwAeZ7JR6YP5zQqnw',
                        'file'=>null,
                        'isApiCheck'=>true
                    );
                    $response = $client->request($api['method'], $url, [
                        'form_params'=>$query
                    ]);
                    $response = $response->getBody()->getContents();
                    $status = "";
                    $api_status = Api::where('id', $api['id'])->get()->first()->status;
                    if($response=="success"){ 
                        $status = "on";
                        if($status!==$api_status) $statusChanged = 1;
                        Api::where('id', $api['id'])->update(array('status'=>'on'));
                    }else{
                        $status = "down";
                        if($status!==$api_status) $statusChanged = 1;
                        Api::where('id', $api['id'])->update(array('status'=>'down')); 
                        $res_success = false;
                        array_push($res_msgs, "Amazon Vendor Central PO Detail Collector API is not working.");
                    }
                    if($api['alert_email']==1 && $statusChanged){
                        foreach ($receivers as $receiver) {
                            if($receiver['type']=="email" && $this->checkEmail($receiver['receiver'])){
                                $param = array(
                                    'to'=>$receiver['receiver'],
                                    'subject'=>"Check API status",
                                    'api_name'=>$api['api_name'],
                                    'status'=>$status
                                );
                                $this->sendEmail("api_validation", $param);
                            }
                        }
                        $testparam = array(
                            'to'=>'ai@jts.ec',
                            'subject'=>"Check API status",
                            'api_name'=>$api['api_name'],
                            'status'=>$status
                        );
                        $this->sendEmail("api_validation", $testparam);
                    }
                    break;
                case "Amazon Vendor Central - Direct Order Collector":
                    break;
                case "CSS SQL Reader":
                    break;
                case "CSS SQL Writer":
                    break;
                case "Amazon Vendor Central Tracking Poster":
                    break;
                case "Amazon Vendor Central Tracking Direct Order Poster":
                    break;
                case "Amazon Vendor Central Tracking Status Checker":
                    $client = new \GuzzleHttp\Client();
                    $url = "https://hzg-amz.jp/api/checkPoStatus";
                    //$url = "http://dev.husqvarna.com/api/checkPoStatus";
                    $query = array(
                        '_token'=>'Jll7q0BSijLOrzaOSm5Dr5hW9cJRZAJKOzvDlxjKCXepwAeZ7JR6YP5zQqnw',
                        'check'=>""
                    );
                    $response = $client->request($api['method'], $url, [
                        'form_params'=>$query
                    ]);
                    $response = $response->getBody()->getContents();
                    $status = "";
                    $api_status = Api::where('id', $api['id'])->get()->first()->status;
                    if($response=="success"){
                        $status = "on";
                        if($status!==$api_status) $statusChanged = 1;
                        Api::where('id', $api['id'])->update(array('status'=>'on'));
                    }else{
                        $status = "down";
                        if($status!==$api_status) $statusChanged = 1;
                        Api::where('id', $api['id'])->update(array('status'=>'down')); 
                        $res_success = false;
                        array_push($res_msgs, "Amazon Vendor Central Tracking Status Checker API is not working.");
                    }
                    if($api['alert_email']==1 && $statusChanged){
                        foreach ($receivers as $receiver) {
                            if($receiver['type']=="email" && $this->checkEmail($receiver['receiver'])){
                                $param = array(
                                    'to'=>$receiver['receiver'],
                                    'subject'=>"Check API status",
                                    'api_name'=>$api['api_name'],
                                    'status'=>$status
                                );
                                $this->sendEmail("api_validation", $param);
                            }
                        }
                        $testparam = array(
                            'to'=>'ai@jts.ec',
                            'subject'=>"Check API status",
                            'api_name'=>$api['api_name'],
                            'status'=>$status
                        );
                        $this->sendEmail("api_validation", $testparam);
                    }
            }
        }
        if($res_success){
            $response = array('success' => $res_success , 'msg' => 'APIs are working properly.' );
        }else{
            $response = array('success' => $res_success , 'msg' => $res_msgs );
        }
        return response()->json($response);
    }
}
