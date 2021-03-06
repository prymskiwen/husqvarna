<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

class ProductTracking extends Model
{
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id', 'order_id', 'product_id' , 'tracking_no'
    ];

    public static function insertData($data)
    {
        $value = DB::table('product_trackings')->where( 'order_id', $data['order_id']) 
        				->where('product_id', $data['product_id'])->first();

        if ($value) {
            DB::table('product_trackings')->where('id', $value->id)->update($data);
        }else{
            DB::table('product_trackings')->insert(array(
            	'order_id' => $data['order_id'],
            	'product_id' => $data['product_id'],
            	'tracking_no' => $data['tracking_no'],
            ));
        }        
    }

    public static function autoinsertData($tracking_no, $order_id)
    {
        $products = DB::table('products')->where( 'order_id', $order_id)->get();

        foreach ($products  as $key => $product) {
            $data = array(
                    "order_id" => $order_id,
                    "tracking_no" => $tracking_no,
                    "product_id" => $product->id
            );
            self::insertData($data);
        }       
    }

}
