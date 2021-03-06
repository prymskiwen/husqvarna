/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/po_dash.js":
/*!*********************************!*\
  !*** ./resources/js/po_dash.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var DatatablesAjax = function () {
  var handleDashboard = function handleDashboard() {
    if (!$().dataTable) {
      return;
    }

    var grid = new Datatable();
    grid.init({
      src: $("#order_po"),
      onSuccess: function onSuccess(grid, response) {// grid:        grid object
        // response:    json object of server side ajax response
        // execute some code after table records loaded
      },
      onError: function onError(grid) {// execute some code on network or other general error  
      },
      onDataLoad: function onDataLoad(grid) {
        // execute some code on ajax data load
        //$(".tracking_no").inputmask({ mask: ["9+9", "99+99", "99+99+99"]});
        $(".tracking_no").inputmask({
          "mask": ["####-####-####", "9999-9999-9999", "9999-9999-9999-999"]
        });
        return true;
      },
      loadingMessage: '????????????????????????...',
      dataTable: {
        // here you can define a typical datatable settings from http://datatables.net/usage/options                 
        // save datatable state(pagination, sort, etc) in cookie.
        "dom": "<'row'<'col-md-4 col-sm-12'pli><'col-md-4 col-sm-12'<'po-data-picker'>><'col-md-4 col-sm-12'f>r>t<'row'<'col-md-4 col-sm-12'pli><'col-md-4 col-sm-12'><'col-md-4 col-sm-12'>>",
        "bStateSave": true,
        "bFilter": true,
        "bInfo": true,
        //"bProcessing" : true,
        "bSortable": true,
        "bPaginate": true,
        // read the custom filters from saved state and populate the filter inputs
        "fnStateSaveParams": function fnStateSaveParams(oSettings, sValue) {},
        // read the custom filters from saved state and populate the filter inputs
        "fnStateLoadParams": function fnStateLoadParams(oSettings, oData) {
          oData.search.search = "";
          oData.order = [5, "desc"];
          return true;
        },
        "lengthMenu": [[10, 20, 50, 100, 150, -1], [10, 20, 50, 100, 150, "All"] // change per page values here
        ],
        "pageLength": 20,
        // default record count per page
        "ajax": {
          "url": "/ajax_dashboard" // ajax source

          /*"dataSrc": function(res){
                for ( var i=0, ien=res.data.length ; i<ien ; i++ ) {
                  
                  res.data[i] = $.map(res.data[i], function(value, index) {                                            
                                  return [value];
                                });
              }         
                App.unblockUI(table.parents(".table-container"));
                               return res.data;                        
          }*/

        },
        "language": {
          "lengthMenu": "&nbsp;<span class='pageLength'>?????????:</span>&nbsp; _MENU_",
          "zeroRecords": "?????????????????????????????????????????????",
          "info": "",
          "infoEmpty": "&nbsp;&nbsp;????????????????????????????????????????????????????????????",
          "emptyTable": "????????????????????????????????????",
          "infoFiltered": "",
          "paginate": {
            "previous": "Prev",
            "next": "Next",
            "last": "Last",
            "first": "First",
            "page": "?????????:&nbsp;",
            "pageOf": "&nbsp;"
          },
          "search": "??????:"
        },
        createdRow: function createdRow(row, data, dataIndex) {
          $(row).attr('data-id', data[0]);
        },
        "columnDefs": [{
          "targets": 0,
          visible: false
        }, {
          "targets": 1,
          "orderable": true,
          "render": function render(data, type, full, meta) {
            $res = "";

            if (data) {
              if (data == "new") {
                $res += '<span>??????</span>';
              } else if (data == "processed") {
                $res += '<span>????????????</span>';
              } else if (data == "confirmed") {
                $res += '<span>?????????</span>';
              }

              return $res;
            } else return "";
          },
          className: 'dt-body-center'
        }, {
          "targets": 2,
          "orderable": true,
          "render": function render(data, type, full, meta) {
            $res = "";

            if (data) {
              $.each(data.split(","), function (key, elem) {
                $res += '<label>' + elem + '</label>';
              });
            } else {
              $res += '<label>????????????</label>';
            }

            return $res;
          },
          className: 'dt-body-center tracking_status'
        }, {
          "targets": 3,
          "orderable": true,
          "render": function render(data, type, full, meta) {
            return '<a href="/order/' + data + '">' + data + '</a>';
          }
        }, {
          "targets": 4,
          className: 'dt-body-center',
          "orderable": true,
          "render": function render(data, type, full, meta) {
            if (data == "2UQ7Z") return '<img src="/images/husqvarna_tiny.png" title="2UQ7Z">';else if (data == "WP1A4") return '<img src="/images/gardena_tiny.png" title="WP1A4">';else return data;
          }
        }, // {
        //     "targets":[6,7],
        //     className:'nowrap'
        // },
        {
          "targets": -3,
          "orderable": true,
          "render": function render(data) {
            if (data) {
              return "??" + data;
            }

            return data;
          },
          className: 'dt-body-right'
        }, {
          "targets": -2,
          "orderable": false,
          "render": function render(data, type, full, meta) {
            if (data == null) data = '';
            var tracking_no_input = '<div class="input-group tracking_box" order-id="' + full[0] + '">';
            tracking_no_input += '<div><select class="form-control input-small input-sm input-inline mr-10">';
            $.each(data.split(','), function (key, elem) {
              if (elem) {
                tracking_no_input += "<option value=" + elem + ">" + elem + "</option>";
              }
            }); //tracking_no_input += "<option value=''>???????????????????????????</option>";

            tracking_no_input += "</select>"; // + "<a class='add_track'><i class='fa fa-plus-circle'></i></a></div>";

            tracking_no_input += '<div><input type="text" class="form-control input-sm input-small tracking_no input-inline" name="tracking_no" placeholder="">' + '<span class="input-group-btn">' + '<button class="btn blue btn-sm" txt="change" type="button">??????</button>' + '</span>' + '</div>';
            tracking_no_input += '</div>';
            return tracking_no_input;
          },
          className: 'product_tracking tracking_number no-product'
        }, {
          "targets": -1,
          "data": null,
          "orderable": false,
          "render": function render(data, type, full, meta) {
            return '<div class="btn-group pull-right">' + '<button class="btn green btn-xs btn-outline dropdown-toggle" data-toggle="dropdown">??????' + '<i class="fa fa-angle-down"></i>' + '</button>' + '<ul class="dropdown-menu pull-right">' + '<li>' + '<form class="po_detail_form" method="post" action="/ajax_import_po_csv" enctype="multipart/form-data">' + '<div class="fileinput fileinput-po" data-provides="fileinput">' + '<span class="btn btn-file">' + '<span class="fileinput-po"><i class="fa fa-file-excel-o"></i>PO CSV???????????????</a></span>' + '<input type="file" name="po_detail_csv" accept=".csv"> </span>' + '</div></form>' + '</li>' + '<li>' + '<a href="/po_detail_pdf/' + full[0] + '" class="pdf_link" download>' + '<i class="fa fa-file-pdf-o"></i>Esker???PDF??????</a>' + '</li>' + '<li>' + '<a href="javascript:;" class="esker_email">' + '<img src="/images/esker.png">Esker???????????????</a>' + '</li>' + '<li>' + '<a href="javascript:;" class="edit">' + '<i class="fa fa-edit"></i>??????</a>' + '</li>' + '<li>' + '<a href="javascript:;" class="delete" >' + '<i class="fa fa-remove"></i>??????</a>' + '</li>' + '</ul>' + '</div>';
          },
          className: "no-product"
        }],
        "ordering": true,
        "order": [[5, "desc"]] // set first column as a default sort by asc

      }
    });
    var table = grid.getTable();
    table.on('click', '.delete', function (e) {
      e.preventDefault();
      var nRow = $(this).parents('tr');
      var data_id = $(nRow).attr("data-id");
      swal({
        title: "",
        text: "?????????????????????",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "??????",
        cancelButtonText: "???????????????",
        closeOnConfirm: false,
        closeOnCancel: false
      }, function (isConfirm) {
        if (isConfirm) {
          grid.getDataTable().ajax.reload();
          swal("??????????????????!", "", "success");
        } else {
          swal("???????????????", "", "error");
        }
      });
    });
    table.on('submit', 'form.po_detail_form', function (e) {
      e.preventDefault();
      var fd = new FormData();
      var files = $(this).find('input[name="po_detail_csv"]')[0].files[0];
      fd.append('file', files);
      fd.append('order_id', $(this).closest('tr').attr('data-id'));
      $.ajax({
        url: '/ajax_import_po_csv',
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function success(res) {
          if (res.success == true) {
            toastr["success"](res.msg, "??????!");
          } else {
            toastr["error"](res.msg, "??????!");
          }
        },
        error: function error(xhr, status, _error) {
          toastr["error"]("?????????????????????????????????", "??????!");
        }
      });
      return false;
    });
    table.on('click', '.pdf_link', function (e) {
      e.preventDefault();
      var the = $(this);
      var data_id = $(this).closest("tr").attr("data-id");
      $.ajax({
        url: '/ajax_order_products',
        type: 'post',
        data: {
          order_id: data_id
        },
        dateType: 'json',
        success: function success(res) {
          if (res.products.length > 0) {
            window.location.href = the.attr("href");
          } else {
            toastr["error"]("?????????????????????????????????????????????", "??????!");
          }
        }
      });
    });
    table.on('click', '.esker_email', function (e) {
      e.preventDefault();
      var the = $(this);
      var data_id = $(this).closest("tr").attr("data-id");
      $.ajax({
        url: '/ajax_esker_email',
        type: 'post',
        data: {
          order_id: data_id
        },
        dateType: 'json',
        success: function success(res) {
          if (res.success == true) {
            toastr["success"]("Esker????????????PDF?????????????????????????????????????????????", "??????!");
          } else {
            toastr["error"](res.msg, "??????!");
          }
        }
      });
    });
    table.on('click', 'tbody tr', function (e) {
      if ($(e.target).closest("td").hasClass("no-product")) {
        return;
      }

      e.preventDefault();

      if ($(this).hasClass("open")) {
        $(this).removeClass("open");
        $(this).next().fadeOut(100, function () {
          $(this).remove();
        });
      } else {
        table.find('tbody tr').removeClass("open");
        var data_id = $(this).attr("data-id");
        var the = $(this);
        table.find("tbody tr.child").fadeOut(100, function () {
          $(this).remove();
        });
        $.ajax({
          url: '/ajax_order_products',
          type: 'post',
          data: {
            order_id: data_id
          },
          dataType: 'json',
          success: function success(res) {
            //console.log(res);
            var p_html = "<tr class='child'><td class='child' colspan='" + the.find('>td').length + "'><table class='table table-bordered po_details'>";
            p_html += "<thead><tr>" + "<td class='nowrap'>ASIN</td>" + "<td class='nowrap'>???????????????</td>" + "<td class='nowrap'>???????????????</td>" + "<td class='nowrap'>?????????</td>" + "<td class='nowrap'>??????</td>" + "<td class='nowrap'>????????????</td>" + "<td class='nowrap'>????????????</td>" + "<td class='nowrap'>????????????????????????</td>" + "<td class='nowrap'>?????????</td>" + "<td class='nowrap'>????????????</td>" + "<td class='nowrap'>?????????????????????</td>" + "<td class='nowrap'>?????????????????????</td>" + "<td class='nowrap'>??????????????????</td>" + "<td class='nowrap'>????????????</td>" + "<td class='nowrap'>??????</td>" + "<td class='nowrap'>??????????????????</td>" + "</tr></thead><tbody>";
            $.each(res.products, function (key, product) {
              var option = "";

              if (res.tracking_number) {
                $.each(res.tracking_number.split(","), function (key, ele) {
                  if (ele) {
                    if (product.tracking_no == ele) {
                      option += "<option value='" + ele + "' selected>" + ele + "</option>";
                    } else {
                      option += "<option value='" + ele + "'>" + ele + "</option>";
                    }
                  }
                });
              }

              var tracking_no_box = "<select class='form-control input-small input-sm input-inline'>" + option + "</select>";

              if (!product.stock) {
                product.stock = 0;
              }

              if (!product.available_date) {
                product.available_date = "";
              }

              p_html += "<tr product-id='" + product.id + "'><td>" + product.asin + "</td>" + "<td>" + product.external_id + "</td>" + "<td>" + product.mordel_number + "</td>" + "<td>" + product.title + "</td>" + "<td>" + product.stock + "</td>" + "<td>" + product.available_date + "</td>" + "<td>" + (product.blockordered ? product.blockordered : '') + "</td>" + "<td>" + product.window_type + "</td>" + "<td>" + product.expected_date + "</td>" + "<td>" + product.quantity_request + "</td>" + "<td>" + product.accepted_quantity + "</td>" + "<td>" + product.quantity_received + "</td>" + "<td>" + product.quantity_outstand + "</td>" + "<td>" + product.unit_cost + "</td>" + "<td>" + product.total_cost + "</td>" + "<td class='product_tracking no-product'>" + tracking_no_box + "</td></tr>";
            });
            p_html += "</tbody></table></td></tr>";
            $(p_html).fadeIn(100, function () {
              $(this).find(".product_tracking select").change(function () {
                $.ajax({
                  url: '/ajax_product_tracking',
                  type: 'post',
                  data: {
                    order_id: data_id,
                    product_id: $(this).closest("tr").attr("product-id"),
                    tracking_no: $(this).val()
                  },
                  dataType: 'json',
                  success: function success(res) {
                    if (res.success == true) {
                      toastr["success"](res.msg, "??????!");
                    } else {
                      toastr["error"](res.msg, "??????!");
                    }
                  }
                });
              });
              $(this).insertAfter(the);
            });
            the.addClass("open");
          }
        });
      }
    });
    var init_date = init_daterange();
    var start_date_val = init_date[0];
    var end_date_val = init_date[1];
    var datepicker = $("<input>", {
      'class': 'form-control input-xs input-sm input-inline ml-10',
      'type': 'text',
      'name': 'po_date_range',
      'value': init_date[0] + ' - ' + init_date[1],
      'disabled': true
    }).daterangepicker({
      opens: 'left',
      locale: {
        format: 'YYYY/MM/DD',
        applyLabel: "??????",
        cancelLabel: "???????????????",
        daysOfWeek: ["???", "???", "???", "???", "???", "???", "???"],
        monthNames: ["1???", "2???", "3???", "4???", "5???", "6???", "7???", "8???", "9???", "10???", "11???", "12???"]
      }
    }, function (start, end, label) {
      start_date_val = start.format('YYYY-MM-DD');
      end_date_val = end.format('YYYY-MM-DD');
      console.log(start_date_val);
      grid.setAjaxParam("start_date_val", start.format('YYYY-MM-DD'));
      grid.setAjaxParam("end_date_val", end.format('YYYY-MM-DD'));
      grid.ajax_reload();
    });
    var date_slider = $("<input>", {
      "id": "po_on_off",
      "type": "checkbox",
      "checked": false,
      'data-toggle': "toggle",
      'data-on': "??????",
      'data-off': "??????",
      'data-onstyle': "primary",
      'data-offstyle': "danger",
      change: function change(e) {
        if ($(this).prop("checked")) {
          grid.setAjaxParam("start_date_val", start_date_val);
          grid.setAjaxParam("end_date_val", end_date_val);
          datepicker.prop('disabled', false);
        } else {
          grid.setAjaxParam("start_date_val", '');
          grid.setAjaxParam("end_date_val", '');
          datepicker.prop('disabled', true);
        }

        grid.ajax_reload();
      }
    });
    var trader_box = $('<select>', {
      "class": 'form-control input-sm input-xsmall input-inline mr-30',
      name: 'trader_type',
      id: 'trader_box',
      html: '<option value="">??????</option><option value="gardena">????????????</option><option value="husqvarna">??????????????????</option>',
      change: function change(e) {
        grid.setAjaxParam("trader_type", $(this).val());
        grid.ajax_reload();
      }
    });
    $(".po-data-picker").append(trader_box).append(date_slider).append(datepicker);
    date_slider.bootstrapToggle();
    table.on('click', '.tracking_box button', function (e) {
      var tracking_box = $(this).closest('.tracking_box');
      var the = $(this);

      if ($(this).attr('txt') == "change") {
        $.ajax({
          type: "post",
          url: '/ajax_tracking_update',
          data: {
            order_id: tracking_box.attr('order-id'),
            tracking_no: tracking_box.find("input").val()
          },
          success: function success(res) {
            if (res.success == true) {
              tracking_box.find("select").prepend("<option value=" + tracking_box.find("input").val() + ">" + tracking_box.find("input").val() + "</option>");
              tracking_box.find("input").val("");
              tracking_box.find("input").focus();
              toastr["success"](res.msg, "??????!");
            } else {
              tracking_box.find("input").val("");
              tracking_box.find("input").focus();
              toastr["error"](res.msg, "??????!");
            }
          }
        });
      }
    });
    table.on('change', '.tracking_box select', function (e) {
      var tracking_box = $(this).closest('.tracking_box');
      var the = $(this);

      if ($(this).val()) {
        tracking_box.find('input').val($(this).val());
        tracking_box.find("input").focus();
      }
    });
  };

  var handleDirect = function handleDirect() {
    if (!$().dataTable) {
      return;
    }

    var grid = new Datatable();
    grid.init({
      src: $("#order_direct"),
      onSuccess: function onSuccess(grid, response) {// grid:        grid object
        // response:    json object of server side ajax response
        // execute some code after table records loaded
      },
      onError: function onError(grid) {// execute some code on network or other general error  
      },
      onDataLoad: function onDataLoad(grid) {// execute some code on ajax data load
      },
      loadingMessage: '????????????????????????...',
      dataTable: {
        // here you can define a typical datatable settings from http://datatables.net/usage/options                 
        // save datatable state(pagination, sort, etc) in cookie.
        "dom": "<'row'<'col-md-4 col-sm-12'pli><'col-md-4 col-sm-12'<'data-picker'>><'col-md-4 col-sm-12'f>r>t<'row'<'col-md-4 col-sm-12'pli><'col-md-4 col-sm-12'><'col-md-4 col-sm-12'>>",
        "bStateSave": true,
        "bFilter": true,
        "bInfo": true,
        //"bProcessing" : true,
        "bSortable": false,
        "bPaginate": true,
        "responsive": true,
        // read the custom filters from saved state and populate the filter inputs
        "fnStateSaveParams": function fnStateSaveParams(oSettings, sValue) {},
        // read the custom filters from saved state and populate the filter inputs
        "fnStateLoadParams": function fnStateLoadParams(oSettings, oData) {},
        "lengthMenu": [[10, 20, 50, 100, 150, -1], [10, 20, 50, 100, 150, "All"] // change per page values here
        ],
        "pageLength": 20,
        // default record count per page
        "ajax": {
          "url": "/ajax_direct_order" // ajax source

          /*"dataSrc": function(res){
                for ( var i=0, ien=res.data.length ; i<ien ; i++ ) {
                  
                  res.data[i] = $.map(res.data[i], function(value, index) {                                            
                                  return [value];
                                });
              }         
                App.unblockUI(table.parents(".table-container"));
                               return res.data;                        
          }*/

        },
        "language": {
          "lengthMenu": "&nbsp;<span class='pageLength'>?????????:</span>&nbsp; _MENU_",
          "zeroRecords": "?????????????????????????????????????????????",
          "info": "",
          "infoEmpty": "&nbsp;&nbsp;????????????????????????????????????????????????????????????",
          "emptyTable": "????????????????????????????????????",
          "infoFiltered": "",
          "paginate": {
            "previous": "Prev",
            "next": "Next",
            "last": "Last",
            "first": "First",
            "page": "?????????:&nbsp;",
            "pageOf": "&nbsp;"
          },
          "search": "??????:"
        },
        createdRow: function createdRow(row, data, dataIndex) {
          $(row).attr('data-id', data[0]);
        },
        "columnDefs": [{
          "targets": 0,
          visible: false
        }, {
          "targets": 17,
          "render": function render(data) {
            if (data) {
              return "??" + data;
            }

            return data;
          },
          className: 'dt-body-right'
        }, {
          "targets": -1,
          "data": null,
          "orderable": false,
          "defaultContent": '<div class="btn-group pull-right">' + '<button class="btn green btn-xs btn-outline dropdown-toggle" data-toggle="dropdown">??????' + '<i class="fa fa-angle-down"></i>' + '</button>' + '<ul class="dropdown-menu pull-right">' + '<li>' + '<a href="javascript:;" class="edit">' + '<i class="fa fa-edit"></i>??????</a>' + '</li>' + '<li>' + '<a href="javascript:;" class="delete" >' + '<i class="fa fa-remove"></i> ?????? </a>' + '</li>' + '</ul>' + '</div>'
        }],
        "ordering": true,
        "order": [[3, "asc"]] // set first column as a default sort by asc

      }
    });
    var table = grid.getTable();
    table.on('click', '.delete', function (e) {
      e.preventDefault();
      var nRow = $(this).parents('tr');
      var data_id = $(nRow).attr("data-id");
      swal({
        title: "",
        text: "?????????????????????",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "??????",
        cancelButtonText: "???????????????",
        closeOnConfirm: false,
        closeOnCancel: false
      }, function (isConfirm) {
        if (isConfirm) {
          grid.getDataTable().ajax.reload();
          swal("??????????????????!", "", "success");
        } else {
          swal("???????????????", "", "error");
        }
      });
    });
    var init_date = init_daterange();
    var start_date_val = init_date[0];
    var end_date_val = init_date[1];
    var datepicker = $("<input>", {
      'class': 'form-control input-xs input-sm input-inline ml-10',
      'type': 'text',
      'name': 'po_date_range',
      'value': init_date[0] + ' - ' + init_date[1],
      'disabled': false
    }).daterangepicker({
      opens: 'left',
      locale: {
        format: 'YYYY/MM/DD',
        applyLabel: "??????",
        cancelLabel: "???????????????",
        daysOfWeek: ["???", "???", "???", "???", "???", "???", "???"],
        monthNames: ["1???", "2???", "3???", "4???", "5???", "6???", "7???", "8???", "9???", "10???", "11???", "12???"]
      }
    }, function (start, end, label) {
      start_date_val = start.format('YYYY-MM-DD');
      end_date_val = end.format('YYYY-MM-DD');
      console.log(start_date_val);
      grid.setAjaxParam("start_date_val", start.format('YYYY-MM-DD'));
      grid.setAjaxParam("end_date_val", end.format('YYYY-MM-DD'));
      grid.ajax_reload();
    });
    var date_slider = $("<input>", {
      "id": "po_on_off",
      "type": "checkbox",
      "checked": false,
      'data-toggle': "toggle",
      'data-on': "??????",
      'data-off': "??????",
      'data-onstyle': "primary",
      'data-offstyle': "danger",
      change: function change(e) {
        if ($(this).prop("checked")) {
          grid.setAjaxParam("start_date_val", '');
          grid.setAjaxParam("end_date_val", '');
          datepicker.prop('disabled', true);
        } else {
          grid.setAjaxParam("start_date_val", start_date_val);
          grid.setAjaxParam("end_date_val", end_date_val);
          datepicker.prop('disabled', false);
        }

        grid.ajax_reload();
      }
    });
    $(".data-picker").append(date_slider).append(datepicker);
    date_slider.bootstrapToggle();
  };

  return {
    //main function to initiate the module
    init: function init() {
      handleDashboard();
      handleDirect();
    }
  };
}();

var init_daterange = function init_daterange() {
  var d = new Date();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var from = d.getFullYear() + '/' + (month < 10 ? '0' : '') + month + '/' + '01';
  var to = d.getFullYear() + '/' + (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;
  return [from, to];
};

jQuery(document).ready(function () {
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "positionClass": "toast-top-right",
    "onclick": null,
    "showDuration": "1000",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };
  DatatablesAjax.init();
});

/***/ }),

/***/ 2:
/*!***************************************!*\
  !*** multi ./resources/js/po_dash.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! E:\web\Laravel\Huqvarna\husqvarna-amazonapi\resources\js\po_dash.js */"./resources/js/po_dash.js");


/***/ })

/******/ });