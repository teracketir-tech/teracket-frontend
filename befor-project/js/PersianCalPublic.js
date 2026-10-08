$(document).ready(function () {
    PersianDateStart();
});
//=========================================================================================

function PersianDateStart()
{
   // jQuery("input[id^=pcal]").persianCalendar();

    //jQuery("input[id^=pcal]").persianCalendar({
    //    initialDate: '1392-10-20',
    //    defaultDate: '1392-10-20'
    //});
    var objCal1 = new AMIB.persianCalendar('pcaldateBrithdayDate', {
            extraInputID: 'pcaldateBrithdayDate',
            extraInputFormat: 'yyyy/mm/dd'
        });
    var objCal2 = new AMIB.persianCalendar('pcaldateStartUniversityDate', {
        extraInputID: 'pcaldateStartUniversityDate',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal3 = new AMIB.persianCalendar('pcaldateEndUniversityDate', {
        extraInputID: 'pcaldateEndUniversityDate',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal4 = new AMIB.persianCalendar('pcaldateMarridDate', {
        extraInputID: 'pcaldateMarridDate',
        extraInputFormat: 'yyyy/mm/dd'
    });
    
    
    var objCal4 = new AMIB.persianCalendar('pcaldateMarridBrithdayDate', {
        extraInputID: 'pcaldateMarridBrithdayDate',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal5 = new AMIB.persianCalendar('pcaldateChildBrithdayDate', {
        extraInputID: 'pcaldateChildBrithdayDate',
        extraInputFormat: 'yyyy/mm/dd'
    });
    
    var objCal6 = new AMIB.persianCalendar('pcaldateStartDoreDate', {
        extraInputID: 'pcaldateStartDoreDate',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal66 = new AMIB.persianCalendar('pcaldateEndDoreDate', {
        extraInputID: 'pcaldateEndDoreDate',
        extraInputFormat: 'yyyy/mm/dd'
    });
    //var objCal7 = new AMIB.persianCalendar('pcalReportdateFromDate', {
    //    extraInputID: 'pcalReportdateFromDate',
    //    extraInputFormat: 'yyyy/mm/dd'
    //});
    //var objCal8 = new AMIB.persianCalendar('pcalReportdateToDate', {
    //    extraInputID: 'pcalReportdateToDate',
    //    extraInputFormat: 'yyyy/mm/dd'
    //});



    //var objCal7 = new AMIB.persianCalendar('pcaldateContractFromDate', {
    //    extraInputID: 'pcaldateContractFromDate',
    //    extraInputFormat: 'yyyy/mm/dd'
    //});

    //var objCal8 = new AMIB.persianCalendar('pcaldateContractToDate', {
    //    extraInputID: 'pcaldateContractToDate',
    //    extraInputFormat: 'yyyy/mm/dd'
    //});

    //var objCal9 = new AMIB.persianCalendar('pcaldateContractRegDate', {
    //    extraInputID: 'pcaldateContractRegDate',
    //    extraInputFormat: 'yyyy/mm/dd'
    //});

    //var objCal10 = new AMIB.persianCalendar('pcaldateContractUnValidDate', {
    //    extraInputID: 'pcaldateContractUnValidDate',
    //    extraInputFormat: 'yyyy/mm/dd'
    //});
    
  

//var objCal2 = new AMIB.persianCalendar( 'pcal2', {
//    initialDate: '1301/1/1',
//}
//);
		
//var objCal3 = new AMIB.persianCalendar( 'pcal3', {
//    defaultDate: '1401/12/12'
//}
//);
		
//var objCal4 = new AMIB.persianCalendar( 'pcal4', {
//    onchange: function( pdate ){
//        if( pdate ) {
//            alert( pdate.join( '/' ) );
//        } else {
//            alert( 'تاریخ واردشده نادرست است' );
//        }
//    }
//}
//);

//var objCal5 = new AMIB.persianCalendar( 'pcal5', {
//    extraInputID: 'extra',
//    extraInputFormat: 'YYYY/MM/DD - yyyy/mm/dd - JD'
//}
//);
}