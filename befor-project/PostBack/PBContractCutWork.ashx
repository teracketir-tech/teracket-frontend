<%@ WebHandler Language="C#" Class="PBContractCutWork" %>


using System;
using System.Web;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.SessionState;


public class PBContractCutWork : IHttpHandler, IReadOnlySessionState
{
    ofcUser _ofcUser;
    Function func = new Function();
    h8.h8 _h8 = new h8.h8();
    HttpContext context = HttpContext.Current;
    OfficeDataContext office;
    FuncAllEdari EdariFunc = new FuncAllEdari();
    JavaScriptSerializer serializer = new JavaScriptSerializer();
    PersianDateTime _PDate = new PersianDateTime(0);
    int BimehProjectAndSaati = 0; // 9421645; // hoghogh sabet + bon + hagh maskan sale  95
    int hoghoghSabet = 0; // hoghogh sabete sale 95
    public void ProcessRequest(HttpContext context)
    {
        string Url = context.Request.Url.Host.Trim().ToLower();
        string HTTP_REFERER = context.Request.ServerVariables["HTTP_REFERER"];
        if (HTTP_REFERER != null && HTTP_REFERER.IndexOf(Url) != -1)
        {
            if (context.Session["Office"] == null) context.Response.Redirect("login.aspx"); else _ofcUser = (ofcUser)context.Session["Office"];
            BimehProjectAndSaati = func.BimehProjectAndSaati;
            hoghoghSabet = func.hoghoghSabet;
            office = new OfficeDataContext(func.Officecstr.Trim());
            int input = Convert.ToInt32(context.Request.Form["i"]);
            switch (input)
            {
                case 1:
                    SaveChangeDateCutWorkPersonel();// ثبت نهایی
                    break;
                case 2:
                    GetInfoPersonelForCutWork();// دریافت اطلاعات قطع همکاری
                    break;
                case 3:
                    ChackkarkardInsert();// چک کردن کارکرد
                    break;
                case 4:
                    GetAlldrpdwnRegisterPersonel();//دریافت کل دراپ دان ها
                    break;
                case 5:
                    GetReportPersonel();//دریافت اطلاعات پرسنلی 
                    break;
            }

        }
    }
    //---------------------------------------------------------------------
    //-----------------------ثبت نهایی--------------------------
    //---------------------------------------------------------------------
    private void SaveChangeDateCutWorkPersonel()
    {
        string InvoiceCode = context.Request.Form["code"];
        string[] invoiceCodearray = InvoiceCode.Split('^').Where(c => !String.IsNullOrEmpty(c)).ToArray();
        string json = "";
        int sumVam = 0, personelcode = 0, invoicecode = 0;
        int checktasvieh = 0;
        int month = 0, year = 0;

        foreach (var item1 in invoiceCodearray)
        {
            personelcode = Convert.ToInt32(item1.Split(',')[1]);
            invoicecode = Convert.ToInt32(item1.Split(',')[0]);
            var q1 = office.ofcPersonels.Where(c => c.numPersonelCode == personelcode).FirstOrDefault();
            if (q1 != null)
            {
                q1.numStatus = 3; // personel ghate hamkari

                var preInvoice = office.ofcPersonelPreInvoices.Where(c => c.numStatus == 3 && c.numPersonelRef == personelcode && c.numInvoiceCode == invoicecode).FirstOrDefault();
                if (preInvoice != null)
                {
                    preInvoice.numStatus = 2; // ghate hamkari
                    preInvoice.dateVarizDate = _PDate.PersianDate;

                    sumVam = 0;
                    checktasvieh = 0;
                    if (preInvoice.strMandeAzMaheGhablTafkiki != "0")
                    {
                        if (Convert.ToInt32(preInvoice.strInvoiceMonth) == 1)
                        {
                            month = 12;
                            year = Convert.ToInt32(preInvoice.strInvoiceYear) - 1;
                        }
                        else
                        {
                            year = Convert.ToInt32(preInvoice.strInvoiceYear);
                            month = Convert.ToInt32(preInvoice.strInvoiceMonth) - 1;
                        }
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                        var VamCheck = office.ofcPersonelVams.Where(c => c.numVamCode == Convert.ToInt32(preInvoice.strVamRef) && c.numStatus == 0 && c.numPersonelRef == preInvoice.numPersonelRef).FirstOrDefault();
                        if (VamCheck != null)
                        {
                            var SumVamVarizi = office.ofcPersonelTasviehVams.Where(c => c.numPersonelRef == preInvoice.numPersonelRef && c.numVamRef == Convert.ToInt32(preInvoice.strVamRef));

                            sumVam = Convert.ToInt32(SumVamVarizi.Sum(c => c.numPriceGhestVam));
                            sumVam = sumVam + Convert.ToInt32(preInvoice.numPriceVamMontly);

                            if (sumVam >= Convert.ToInt32(VamCheck.numPriceVam))
                            {
                                checktasvieh = 1;
                                VamCheck.numStatus = 1; // tasvieh shode
                                VamCheck.dateTasviehDate = _PDate.PersianDate;
                            }

                            office.ofcPersonelTasviehVams.InsertOnSubmit(new ofcPersonelTasviehVam
                            {
                                numPersonelRef = preInvoice.numPersonelRef,
                                numVamRef = Convert.ToInt32(preInvoice.strVamRef),
                                dateRegisterDate = _PDate.PersianDate,
                                numPriceGhestVam = Convert.ToInt32(preInvoice.numPriceVamMontly),
                                strRegisterUserRef = _ofcUser.strUserCode
                            });
                        }
                        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        var checkMosaede = office.ofcPersonelMosaedes.Where(c => c.numPersonelRef == preInvoice.numPersonelRef && c.numStatus == 0 && c.numMonth == Convert.ToInt32(month) && c.numYear == Convert.ToInt32(year));
                        if (checkMosaede.Any())
                        {
                            foreach (var itemmosaede in checkMosaede)
                            {
                                itemmosaede.numStatus = 1; // tasvieh shode
                                itemmosaede.dateTasviehDate = _PDate.PersianDate;
                            }
                        }
                        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        var checkPadash1 = office.ofcPersonelPadashAndJarimehs.Where(c => c.numPersonelRef == preInvoice.numPersonelRef && c.numMonth == Convert.ToInt32(month) && c.numYear == Convert.ToInt32(year) && c.numStatus == 0);// kasr / ezafe be hoghogh
                        if (checkPadash1.Any())
                        {
                            foreach (var itemPadash in checkPadash1)
                            {
                                itemPadash.numStatus = 1; // tasvieh shode
                                itemPadash.dateTasviehDate = _PDate.PersianDate;
                            }
                        }


                        try { office.SubmitChanges(); } catch { }

                    }
                    //*******************************************************************************
                    if (Convert.ToInt32(preInvoice.numPriceVamMontly) > 0)
                    {
                        if (checktasvieh == 0)
                        {
                            var VamCheck1 = office.ofcPersonelVams.Where(c => c.numVamCode == Convert.ToInt32(preInvoice.strVamRef) && c.numStatus == 0 && c.numPersonelRef == preInvoice.numPersonelRef).FirstOrDefault();
                            var SumVamVarizi1 = office.ofcPersonelTasviehVams.Where(c => c.numPersonelRef == preInvoice.numPersonelRef && c.numVamRef == Convert.ToInt32(preInvoice.strVamRef));

                            sumVam = Convert.ToInt32(SumVamVarizi1.Sum(c => c.numPriceGhestVam));
                            sumVam = sumVam + Convert.ToInt32(preInvoice.numPriceVamMontly);

                            if (sumVam >= Convert.ToInt32(VamCheck1.numPriceVam))
                            {
                                VamCheck1.numStatus = 1; // tasvieh shode
                                VamCheck1.dateTasviehDate = _PDate.PersianDate;
                            }

                            office.ofcPersonelTasviehVams.InsertOnSubmit(new ofcPersonelTasviehVam
                            {
                                numPersonelRef = preInvoice.numPersonelRef,
                                numVamRef = Convert.ToInt32(preInvoice.strVamRef),
                                dateRegisterDate = _PDate.PersianDate,
                                numPriceGhestVam = Convert.ToInt32(preInvoice.numPriceVamMontly),
                                strRegisterUserRef = _ofcUser.strUserCode
                            });
                        }
                    }
                    //*******************************************************************************
                    if (preInvoice.numPriceMosaede > 0)
                    {
                        var checkMosaede1 = office.ofcPersonelMosaedes.Where(c => c.numPersonelRef == preInvoice.numPersonelRef && c.numStatus == 0 && c.numMonth == Convert.ToInt16(preInvoice.strInvoiceMonth) && c.numYear == Convert.ToInt16(preInvoice.strInvoiceYear));
                        if (checkMosaede1.Any())
                        {
                            foreach (var itemmosaede in checkMosaede1)
                            {
                                itemmosaede.numStatus = 1; // tasvieh shode
                                itemmosaede.dateTasviehDate = _PDate.PersianDate;
                            }
                        }

                    }
                    //*******************************************************************************
                    var checkPadash = office.ofcPersonelPadashAndJarimehs.Where(c => c.numPersonelRef == preInvoice.numPersonelRef && c.numMonth == Convert.ToInt16(preInvoice.strInvoiceMonth) && c.numYear == Convert.ToInt16(preInvoice.strInvoiceYear) && c.numStatus == 0);// kasr / ezafe be hoghogh
                    if (checkPadash.Any())
                    {
                        foreach (var itemPadash in checkPadash)
                        {
                            itemPadash.numStatus = 1; // tasvieh shode
                            itemPadash.dateTasviehDate = _PDate.PersianDate;
                        }
                    }
                    //*******************************************************************************

                    var qleave = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == preInvoice.numPersonelRef && c.numMonth == Convert.ToInt16(preInvoice.strInvoiceMonth) && c.numYear == Convert.ToInt16(preInvoice.strInvoiceYear) && (c.numStatus == 2 || c.numStatus == 1));
                    if (qleave.Any())
                    {
                        foreach (var itemleave in qleave)
                        {
                            itemleave.numStatus = 3;
                        }
                    }
                    //*******************************************************************************

                    var checkFaraiand = office.ofcPersonelFaraiands.Where(c => c.numPersonelRef == preInvoice.numPersonelRef && c.numStatus == 0 && c.numMonthJob == Convert.ToInt16(preInvoice.strInvoiceMonth) && c.numYear == Convert.ToInt16(preInvoice.strInvoiceYear));
                    if (checkFaraiand.Any())
                    {
                        foreach (var itemFaraiand in checkFaraiand)
                        {
                            itemFaraiand.numStatus = 1; // ok shod
                        }
                    }
                    //*******************************************************************************

                }
                //================================ saati ===============================
                var preInvoiceSaati = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numStatus == 3 && c.numPersonelRef == personelcode && c.numInvoiceSaatiCode == invoicecode).FirstOrDefault();
                if (preInvoiceSaati != null)
                {
                    //====================================================================================
                    preInvoiceSaati.numStatus = 2; // ghate hamkari
                    preInvoiceSaati.dateVarizDate = _PDate.PersianDate;
                    sumVam = 0;
                    checktasvieh = 0;
                    if (preInvoiceSaati.strMandeAzMaheGhablTafkiki != "0")
                    {
                        if (Convert.ToInt32(preInvoiceSaati.strInvoiceMonth) == 1)
                        {
                            month = 12;
                            year = Convert.ToInt32(preInvoiceSaati.strInvoiceYear) - 1;
                        }
                        else
                        {
                            year = Convert.ToInt32(preInvoiceSaati.strInvoiceYear);
                            month = Convert.ToInt32(preInvoiceSaati.strInvoiceMonth) - 1;
                        }
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                        var VamCheck = office.ofcPersonelVams.Where(c => c.numVamCode == Convert.ToInt32(preInvoiceSaati.strVamRef) && c.numStatus == 0 && c.numPersonelRef == preInvoiceSaati.numPersonelRef).FirstOrDefault();
                        if (VamCheck != null)
                        {
                            var SumVamVarizi = office.ofcPersonelTasviehVams.Where(c => c.numPersonelRef == preInvoiceSaati.numPersonelRef && c.numVamRef == Convert.ToInt32(preInvoiceSaati.strVamRef));

                            sumVam = Convert.ToInt32(SumVamVarizi.Sum(c => c.numPriceGhestVam));
                            sumVam = sumVam + Convert.ToInt32(preInvoiceSaati.numPriceVamMontly);

                            if (sumVam >= Convert.ToInt32(VamCheck.numPriceVam))
                            {
                                checktasvieh = 1;
                                VamCheck.numStatus = 1; // tasvieh shode
                                VamCheck.dateTasviehDate = _PDate.PersianDate;
                            }

                            office.ofcPersonelTasviehVams.InsertOnSubmit(new ofcPersonelTasviehVam
                            {
                                numPersonelRef = preInvoiceSaati.numPersonelRef,
                                numVamRef = Convert.ToInt32(preInvoiceSaati.strVamRef),
                                dateRegisterDate = _PDate.PersianDate,
                                numPriceGhestVam = Convert.ToInt32(preInvoiceSaati.numPriceVamMontly),
                                strRegisterUserRef = _ofcUser.strUserCode
                            });
                        }

                        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                        var checkMosaede = office.ofcPersonelMosaedes.Where(c => c.numPersonelRef == preInvoiceSaati.numPersonelRef && c.numStatus == 0 && c.numMonth == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(year));
                        if (checkMosaede.Any())
                        {
                            foreach (var itemmosaede in checkMosaede)
                            {
                                itemmosaede.numStatus = 1; // tasvieh shode
                                itemmosaede.dateTasviehDate = _PDate.PersianDate;
                            }
                        }
                        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                        var checkPadash1 = office.ofcPersonelPadashAndJarimehs.Where(c => c.numPersonelRef == preInvoiceSaati.numPersonelRef && c.numMonth == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(year) && c.numStatus == 0);// kasr / ezafe be hoghogh
                        if (checkPadash1.Any())
                        {
                            foreach (var itemPadash in checkPadash1)
                            {
                                itemPadash.numStatus = 1; // tasvieh shode
                                itemPadash.dateTasviehDate = _PDate.PersianDate;
                            }
                        }


                        try { office.SubmitChanges(); } catch { }

                    }
                    //*******************************************************************************
                    //*******************************************************************************

                    if (Convert.ToInt32(preInvoiceSaati.numPriceVamMontly) > 0)
                    {
                        if (checktasvieh == 0)
                        {
                            var VamCheck1 = office.ofcPersonelVams.Where(c => c.numVamCode == Convert.ToInt32(preInvoiceSaati.strVamRef) && c.numStatus == 0 && c.numPersonelRef == preInvoiceSaati.numPersonelRef).FirstOrDefault();
                            if (VamCheck1 != null)
                            {
                                var SumVamVarizi1 = office.ofcPersonelTasviehVams.Where(c => c.numPersonelRef == preInvoiceSaati.numPersonelRef && c.numVamRef == Convert.ToInt32(preInvoiceSaati.strVamRef));
                                sumVam = Convert.ToInt32(SumVamVarizi1.Sum(c => c.numPriceGhestVam));
                                sumVam = sumVam + Convert.ToInt32(preInvoiceSaati.numPriceVamMontly);
                                if (sumVam >= Convert.ToInt32(VamCheck1.numPriceVam))
                                {
                                    VamCheck1.numStatus = 1; // tasvieh shode
                                    VamCheck1.dateTasviehDate = _PDate.PersianDate;
                                }

                                office.ofcPersonelTasviehVams.InsertOnSubmit(new ofcPersonelTasviehVam
                                {
                                    numPersonelRef = preInvoiceSaati.numPersonelRef,
                                    numVamRef = Convert.ToInt32(preInvoiceSaati.strVamRef),
                                    dateRegisterDate = _PDate.PersianDate,
                                    numPriceGhestVam = Convert.ToInt32(preInvoiceSaati.numPriceVamMontly),
                                    strRegisterUserRef = _ofcUser.strUserCode
                                });
                            }
                        }
                    }
                    //*******************************************************************************
                    if (preInvoiceSaati.numPriceMosaede > 0)
                    {
                        var checkMosaede1 = office.ofcPersonelMosaedes.Where(c => c.numPersonelRef == preInvoiceSaati.numPersonelRef && c.numStatus == 0 && c.numMonth == Convert.ToInt16(preInvoiceSaati.strInvoiceMonth) && c.numYear == Convert.ToInt16(preInvoiceSaati.strInvoiceYear));
                        if (checkMosaede1.Any())
                        {
                            foreach (var itemMosaede in checkMosaede1)
                            {
                                itemMosaede.numStatus = 1; // tasvieh shode
                                itemMosaede.dateTasviehDate = _PDate.PersianDate;
                            }
                        }

                    }
                    //*******************************************************************************
                    var checkPadash = office.ofcPersonelPadashAndJarimehs.Where(c => c.numPersonelRef == preInvoiceSaati.numPersonelRef && c.numMonth == Convert.ToInt16(preInvoiceSaati.strInvoiceMonth) && c.numYear == Convert.ToInt16(preInvoiceSaati.strInvoiceYear) && c.numStatus == 0);// kasr / ezafe be hoghogh
                    if (checkPadash != null)
                    {
                        foreach (var itemPadash in checkPadash)
                        {
                            itemPadash.numStatus = 1; // tasvieh shode
                            itemPadash.dateTasviehDate = _PDate.PersianDate;
                        }
                    }
                    //*******************************************************************************

                    var qleave = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == preInvoiceSaati.numPersonelRef && c.numMonth == Convert.ToInt16(preInvoiceSaati.strInvoiceMonth) && c.numYear == Convert.ToInt16(preInvoiceSaati.strInvoiceYear) && (c.numStatus == 2 || c.numStatus == 1)).FirstOrDefault();
                    if (qleave != null)
                    {
                        qleave.numStatus = 3;
                    }

                    var checkFaraiand = office.ofcPersonelFaraiands.Where(c => c.numPersonelRef == preInvoiceSaati.numPersonelRef && c.numStatus == 0 && c.numMonthJob == Convert.ToInt16(preInvoiceSaati.strInvoiceMonth) && c.numYear == Convert.ToInt16(preInvoiceSaati.strInvoiceYear));
                    if (checkFaraiand.Any())
                    {
                        foreach (var itemFaraiand in checkFaraiand)
                        {
                            itemFaraiand.numStatus = 1; // ok shod
                        }
                    }
                }
            }
        }
        //==============================================
        try
        {
            office.SubmitChanges();
            json = serializer.Serialize((object)"1");// 
        }
        catch
        {
            json = serializer.Serialize((object)"2"); // 
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //-------------------------------------------------
    //---------------------------------------------------------------------
    public void GetInfoPersonelForCutWork()
    {
        int personelcode = Convert.ToInt32(context.Request.Form["personelcode"]);
        string json = "";
        var check = office.ofcPersonels.Where(c => c.numPersonelCode == personelcode).FirstOrDefault();
        if (check != null)
        {

            //string datefromcalc = Year.ToString() + "/" + (month.ToString().Length == 1 ? "0" + month.ToString() : month.ToString()) + "/01";
            //string daytoclac = "30";

            //var checkmonth = office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == Convert.ToInt32(month) && c.numYear == Convert.ToInt32(Year)).FirstOrDefault();
            //if (checkmonth != null) daytoclac = checkmonth.numCountDay.ToString();

            //string datetocalc = Year.ToString() + "/" + (month.ToString().Length == 1 ? "0" + month.ToString() : month.ToString()) + "/" + (daytoclac.Length == 1 ? "0" + daytoclac : daytoclac);

            //int cntendcontract = (from t in office.ofcPersonels
            //                      join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
            //                      where
            //                          (t.numStatus == 1 || t.numStatus == 2)
            //                          &&
            //                          t1.numStatus == 1
            //                          &&
            //                           string.Compare(t1.dateEndContractDate, datetocalc) < 0
            //                      // (string.Compare(t1.dateEndContractDate, datefromcalc) >= 0 && string.Compare(t1.dateEndContractDate, datetocalc) <= 0)
            //                      select t.numPersonelCode).Count();

            int cntendcontract = 0;
            if (cntendcontract == 0)
            {

                var checkcontract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == personelcode).OrderByDescending(c => c.numContractCode).FirstOrDefault();
                if (checkcontract != null)
                {

                    int preinvoice = 0;
                    var checkpreinvoice = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == personelcode && c.numStatus == 3).FirstOrDefault();
                    if (checkpreinvoice != null)
                    {
                        if (checkcontract.numContractKindRef == 1 || checkcontract.numContractKindRef == 3)
                        {
                            preinvoice = 1;
                            var q = (from t in office.ofcPersonels
                                     join t1 in office.ofcPersonelPreInvoices on t.numPersonelCode equals t1.numPersonelRef
                                     join t2 in office.ofcPersonelContracts on t1.numContractRef equals t2.numContractCode
                                     join t3 in office.ofcBContractKinds on t2.numContractKindRef equals t3.numContractKindCode
                                     where t.numPersonelCode == personelcode
                                           &&
                                           t1.numStatus == 3
                                     select new
                                     {
                                         t.numPersonelCode,
                                         personelname = t.strPersonelName + " " + t.strPersonelFamily,
                                         monthname = EdariFunc.GetMonthName(t1.strInvoiceMonth),
                                         t1.strInvoiceYear,
                                         t1.numPriceCalcHoghoghKhales,
                                         t1.numInvoiceCode,
                                         t3.strContractKindName,
                                         t2.dateStartContractDate,
                                         t2.dateCutWorkDate,
                                         monthkarkard = Getmonthnam((int)t.numPersonelCode, (int)t1.numContractKindRef, (int)t1.numMonthlyJobRef),
                                     });

                            json = serializer.Serialize((object)q); // 
                            json = "[" + json + ",2]";
                        }

                    }
                    var checkpreinvoicesaati = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numPersonelRef == personelcode && c.numStatus == 3).FirstOrDefault();
                    if (checkpreinvoicesaati != null)
                    {
                        if (checkcontract.numContractKindRef == 2)
                        {

                            preinvoice = 1;

                            var q = (from t in office.ofcPersonels
                                     join t1 in office.ofcPersonelPreInvoiceSaatis on t.numPersonelCode equals t1.numPersonelRef
                                     join t2 in office.ofcPersonelContracts on t1.numContractRef equals t2.numContractCode
                                     join t3 in office.ofcBContractKinds on t2.numContractKindRef equals t3.numContractKindCode
                                     where t.numPersonelCode == personelcode
                                           &&
                                           t1.numStatus == 3
                                     select new
                                     {
                                         t.numPersonelCode,
                                         personelname = t.strPersonelName + " " + t.strPersonelFamily,
                                         monthname = EdariFunc.GetMonthName(t1.strInvoiceMonth),
                                         t1.strInvoiceYear,
                                         t1.numPriceCalcHoghoghKhales,
                                         numInvoiceCode = t1.numInvoiceSaatiCode,
                                         t3.strContractKindName,
                                         t2.dateStartContractDate,
                                         t2.dateCutWorkDate,
                                         monthkarkard = Getmonthnam((int)t.numPersonelCode, (int)t1.numContractKindRef, (int)t1.numMonthlyJobSaatiRef),
                                     });

                            json = serializer.Serialize((object)q); // 
                            json = "[" + json + ",2]";

                        }
                    }

                    if (preinvoice == 0)
                    {
                        int checkkarkard = 0;
                        if (checkcontract.numContractKindRef == 1 || checkcontract.numContractKindRef == 3)
                            checkkarkard = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).Count();
                        else if (checkcontract.numContractKindRef == 2)
                            checkkarkard = office.ofcPersonelMonthlyJobSaatis.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).Count();
                        //================================================================================
                        if (checkkarkard > 0)
                        {

                            if ((check.numStatus == 1 || check.numStatus == 2))
                            {
                                var q = (from t in office.ofcPersonels
                                         join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                                         join t3 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t3.numWorkGroupCode into join_t3
                                         from t3 in join_t3.DefaultIfEmpty()
                                         join t4 in office.ofcBContractKinds on t1.numContractKindRef equals t4.numContractKindCode
                                         where
                                              t1.numStatus == 1
                                              &&
                                              (t.numStatus == 2 || t.numStatus == 1)
                                              &&
                                              t.numPersonelCode == personelcode
                                         select new
                                         {
                                             t.numPersonelCode,
                                             strPersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                                             t1.dateCutWorkDate,
                                             t1.dateEndContractDate,
                                             t1.dateStartContractDate,
                                             t4.strContractKindName,
                                             t1.StrContractUniqCode,
                                             t.numWorkGroupRef,
                                             strWorkGroupName = (t3.strWorkGroupName == null || t3.strWorkGroupName == "" ? "نامشخص" : t3.strWorkGroupName),
                                             monthkarkard = Getmonthnam((int)t.numPersonelCode, (int)t1.numContractKindRef, 0),
                                         });


                                json = serializer.Serialize((object)q); // 
                                json = "[" + json + ",1]";
                            }
                            else
                            {
                                json = serializer.Serialize((object)"3"); // 

                            }
                        }
                        else
                        {
                            json = serializer.Serialize((object)"11"); // 

                        }
                    }

                }
                else
                {
                    json = serializer.Serialize((object)"12"); // 

                }
            }
            else
            {
                json = serializer.Serialize((object)"10"); // 
            }
        }
        else
        {
            json = serializer.Serialize((object)"2"); // 
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //==========================================================================
    private string Getmonthnam(int personelcode, int contractkind, int nummonthjobcode)
    {
        string ret = "";
        if (contractkind == 1 || contractkind == 3)
        {
            var q = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == personelcode && ((nummonthjobcode == 0 && c.numStatus == 0) || (nummonthjobcode != 0 && c.numMonthlyJobCode == nummonthjobcode && c.numStatus == 0))).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobCode).FirstOrDefault();
            if (q != null)
            {
                ret = "کارکرد سال " + q.numYear.ToString() + " ماه " + EdariFunc.GetMonthName(q.numMonthJob.ToString());
            }
        }
        else if (contractkind == 2)
        {
            var q = office.ofcPersonelMonthlyJobSaatis.Where(c => c.numPersonelRef == personelcode && ((nummonthjobcode == 0 && c.numStatus == 0) || (nummonthjobcode != 0 && c.numMonthlyJobSaatiCode == nummonthjobcode && c.numStatus == 0))).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobSaatiCode).FirstOrDefault();
            if (q != null)
            {
                ret = "کارکرد سال " + q.numYear.ToString() + " ماه " + EdariFunc.GetMonthName(q.numMonthJob.ToString());
            }
        }
        return ret;
    }
    //---------------------------------------------------------------------------
    //---------------------------------------------------------------------------
    //---------------------------------------------------------------------------
    private void ChackkarkardInsert()
    {
        int personelcode = Convert.ToInt32(context.Request.Form["personelcode"]);
        string dateEnd = context.Request.Form["dateEnd"];
        string datestart = context.Request.Form["datestart"];
        string datecut = context.Request.Form["datecut"];
        string type = context.Request.Form["type"];
        string arrayCutWork = context.Request.Form["strtemp"];


        string json = "";
        if (type == "1")
        {
            string[] arrayTemp = arrayCutWork.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
            string Year = "";
            foreach (var item in arrayTemp)
            {
                Year = item.Split('^')[5].Trim();
            }
            var checkcontract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == personelcode && c.numStatus == 1 && ((string.Compare(c.dateStartContractDate, datecut) <= 0) && (string.Compare(c.dateEndContractDate, datecut) >= 0))).FirstOrDefault();
            if (checkcontract != null)
            {
                var check = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobCode).FirstOrDefault();
                if (check != null)
                {
                    string[] arraycut = datecut.Split('/');
                    if (Convert.ToInt32(arraycut[0]) == Convert.ToInt32(check.numYear) && Convert.ToInt32(arraycut[1]) == Convert.ToInt32(check.numMonthJob))
                    {
                        string ret = PresaveCutwork(arrayCutWork, personelcode, type);
                        if (ret == "1")
                            json = serializer.Serialize((object)"1"); // 
                        else
                            json = serializer.Serialize((object)"5"); // 
                    }
                    else
                        json = serializer.Serialize((object)"4"); // 
                }
                else
                {
                    var checksaati = office.ofcPersonelMonthlyJobSaatis.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobSaatiCode).FirstOrDefault();
                    if (checksaati != null)
                    {
                        string[] arraycut = datecut.Split('/');
                        if (Convert.ToInt32(arraycut[0]) == Convert.ToInt32(checksaati.numYear) && Convert.ToInt32(arraycut[1]) == Convert.ToInt32(checksaati.numMonthJob))
                        {
                            string ret = PresaveCutwork(arrayCutWork, personelcode, type);
                            if (ret == "1")
                                json = serializer.Serialize((object)"1"); // 
                            else
                                json = serializer.Serialize((object)"5"); // 
                        }
                        else
                            json = serializer.Serialize((object)"4"); // 
                    }
                    else
                        json = serializer.Serialize((object)"2"); // 
                }
            }
            else
            {
                json = serializer.Serialize((object)"3"); // 
            }
        }
        else if (type == "2") //محاسبه مجدد
        {
            string ret = PresaveCutwork(arrayCutWork, personelcode, type);
            if (ret == "1")
                json = serializer.Serialize((object)"1"); // 
            else
                json = serializer.Serialize((object)"5"); // 
        }
        else if (type == "3") //حذف محاسبه 
        {
            string ret = PresaveCutwork(arrayCutWork, personelcode, type);
            if (ret == "1")
                json = serializer.Serialize((object)"1"); // 
            else
                json = serializer.Serialize((object)"5"); // 
        }

        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //------------------------------دریافت کل دراپ دان ها----------------
    //---------------------------------------------------------------------
    public void GetAlldrpdwnRegisterPersonel()
    {
        var Marrid = from t in office.ofcBMarrids
                     where t.numStatus == 1
                     select new
                     {
                         value = t.numMarridCode,
                         item = t.strMarridName
                     };

        var privonce = from t in office.ofcBProvinces
                       select new
                       {
                           value = t.strProvinceCode,
                           item = t.strProvinceName
                       };
        var city = from t in office.ofcBCities
                   select new
                   {
                       value = t.strCityCode,
                       item = t.strCityName,
                       value2 = t.numProvinceRef
                   };

        var ContractKinds = from t in office.ofcBContractKinds
                            select new
                            {
                                value = t.numContractKindCode,
                                item = t.strContractKindName,
                            };
        var Employers = from t in office.ofcBEmployers
                        select new
                        {
                            value = t.numEmployerCode,
                            item = t.strEmployerName,
                        };
        var UnitOrganizations = from t in office.ofcBUnitOrganizations
                                select new
                                {
                                    value = t.numUnitOrganizationCode,
                                    item = t.strUnitOrganizationName,
                                };

        var jensiat = from t in office.ofcBJensiats
                      where t.numStatus == 1
                      select new
                      {
                          value = t.numJensiatCode,
                          item = t.strJensiatName
                      };
        var workgroup = from t in office.ofcBWorkGroups
                        where t.numStatus == 1
                        select new
                        {
                            value = t.numWorkGroupCode,
                            item = t.strWorkGroupName
                        };

        string json1 = serializer.Serialize((object)Marrid);
        string json2 = serializer.Serialize((object)privonce);
        string json3 = serializer.Serialize((object)city);
        string json4 = serializer.Serialize((object)ContractKinds);
        string json5 = serializer.Serialize((object)Employers);
        string json6 = serializer.Serialize((object)UnitOrganizations);
        string json7 = serializer.Serialize((object)jensiat);
        string json8 = serializer.Serialize((object)workgroup);

        string json = "[" + json1 + "," + json2 + "," + json3 + "," + json4 + "," + json5 + "," + json6 + "," + json7 + "," + json8 + "]";
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------دریافت اطلاعات پرسنلی ------------------------
    //----------------------------------------------------------------------
    private void GetReportPersonel()
    {
        string personelcode = context.Request.Form["personelcode"];
        string ContractKind = context.Request.Form["ContractKind"];
        string Employer = context.Request.Form["Employer"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string DateFrom = context.Request.Form["DateFrom"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        string DateTo = context.Request.Form["DateTo"];
        string checkCutwork = context.Request.Form["checkCutwork"];

        //  int status = Convert.ToInt32(context.Request.Form["status"]);
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;

        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }

        var q = from t in office.ofcPersonelPreInvoices
                join t1 in office.ofcPersonelContracts on t.numContractRef equals t1.numContractCode
                join t2 in office.ofcBContractKinds on t.numContractKindRef equals t2.numContractKindCode
                join t3 in office.ofcPersonels on t.numPersonelRef equals t3.numPersonelCode
                join t4 in office.ofcBEmployers on t3.numEmployerRef equals t4.numEmployerCode
                join t5 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t5.numWorkGroupCode into t5_joined
                from t5 in t5_joined.DefaultIfEmpty()
                where
                         (t3.numEmployerRef == Convert.ToInt32(Employer) || Employer == "-1")
                         &&
                         ((t3.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                         ||
                         (t3.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                         ||
                             name == "")
                         &&
                         (t3.strMelliCode == mellicode || mellicode == "")
                         &&
                         (t3.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                         &&
                         (t1.numContractKindRef == Convert.ToInt32(ContractKind) || ContractKind == "-1")
                         &&
                         (((grohkariRoomArray).Contains(t1.numWorkGroupRef.ToString()) || ((grohkariRoomArray).Contains("-2") && t1.numWorkGroupRef == null)) || grohkari == "-1")
                         &&
                         (string.Compare(t1.dateCutWorkDate, DateFrom) >= 0 && string.Compare(t1.dateCutWorkDate, DateTo) <= 0)
                         &&
                         t1.numStatus == 0
                         &&
                        ((checkCutwork == "1" && t.numStatus == 3) || (checkCutwork == "0" && t.numStatus == 2))
                select new
                {
                    PersonelName = t3.strPersonelName.Trim() + " " + t3.strPersonelFamily.Trim(),
                    strMelliCode = t3.strMelliCode,
                    strNumberShenasname = t3.strNumberShenasname,
                    dateBrithdayDate = t3.dateBrithdayDate,
                    strEmployerName = t4.strEmployerName,
                    numStatus = t3.numStatus,
                    numPersonelCode = t.numPersonelRef,
                    dateStartContractDate = t1.dateStartContractDate,
                    t2.strContractKindName,
                    strWorkGroupName = t5.strWorkGroupName,
                    numStatusContract = t1.numStatus,
                    numContractCode = t1.numContractCode,
                    dateCutWorkDate = t1.dateCutWorkDate
                };

        var qq = from t in office.ofcPersonelPreInvoiceSaatis
                 join t1 in office.ofcPersonelContracts on t.numContractRef equals t1.numContractCode
                 join t2 in office.ofcBContractKinds on t.numContractKindRef equals t2.numContractKindCode
                 join t3 in office.ofcPersonels on t.numPersonelRef equals t3.numPersonelCode
                 join t4 in office.ofcBEmployers on t3.numEmployerRef equals t4.numEmployerCode
                 join t5 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t5.numWorkGroupCode into t5_joined
                 from t5 in t5_joined.DefaultIfEmpty()
                 where
                          (t3.numEmployerRef == Convert.ToInt32(Employer) || Employer == "-1")
                          &&
                          ((t3.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                          ||
                          (t3.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                          ||
                              name == "")
                          &&
                          (t3.strMelliCode == mellicode || mellicode == "")
                          &&
                          (t3.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                          &&
                          (t1.numContractKindRef == Convert.ToInt32(ContractKind) || ContractKind == "-1")
                          &&
                          (((grohkariRoomArray).Contains(t1.numWorkGroupRef.ToString()) || ((grohkariRoomArray).Contains("-2") && t1.numWorkGroupRef == null)) || grohkari == "-1")
                          &&
                          (string.Compare(t1.dateCutWorkDate, DateFrom) >= 0 && string.Compare(t1.dateCutWorkDate, DateTo) <= 0)
                          &&
                          t1.numStatus == 0
                          &&
                          t.numStatus == 2
                 select new
                 {
                     PersonelName = t3.strPersonelName,
                     strMelliCode = t3.strMelliCode,
                     strNumberShenasname = t3.strNumberShenasname,
                     dateBrithdayDate = t3.dateBrithdayDate,
                     strEmployerName = t4.strEmployerName,
                     numStatus = t3.numStatus,
                     numPersonelCode = t.numPersonelRef,
                     dateStartContractDate = t1.dateStartContractDate,
                     t2.strContractKindName,
                     strWorkGroupName = t5.strWorkGroupName,
                     numStatusContract = t1.numStatus,
                     numContractCode = t1.numContractCode,
                     dateCutWorkDate = t1.dateCutWorkDate
                 };
        var personel = q.Union(qq);
        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = personel.Count();
        var query = personel.OrderBy(o => o.dateCutWorkDate).ThenBy(c => c.numPersonelCode).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);

        //int Isvalid = 0;
        //if ((new string[] { "0077567722", "20800736" }).Contains(_ofcUser.strUserCode.Trim())) Isvalid = 1;

        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //---------------------------------------------------------------------------
    //------------------------پیش ثبت قطع همکاری-------------------------------
    //---------------------------------------------------------------------------

    private string PresaveCutwork(string strtemp, int personelcodeMain, string type)
    {
        string ret = "";
        string[] array = strtemp.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
        int personelcode = 0, PriceSaier = 0;
        string dateCutWork = "", iseidi = "false", DescSaier = "";
        if (type == "1") // pish sabt
        {
            foreach (var item1 in array)
            {
                personelcode = Convert.ToInt32(item1.Split('^')[0]);
                dateCutWork = item1.Split('^')[1].Trim();
                iseidi = item1.Split('^')[4].Trim();
                PriceSaier = Convert.ToInt32(item1.Split('^')[2]);
                DescSaier = item1.Split('^')[3].Trim();

                ret = CalcCutwork(personelcode, dateCutWork, iseidi, PriceSaier, DescSaier);
            }
        }
        else if (type == "2" || type == "3") // mohasebe mojadad - hazf mohasebe
        {
            //=========================================
            var qpersonel = office.ofcPersonels.Where(c => c.numPersonelCode == personelcodeMain).FirstOrDefault();
            if (qpersonel != null)
            {
                if (qpersonel.numBlodRef == null) qpersonel.numStatus = 1;
                else qpersonel.numStatus = 2;
            }
            //=========================================
            var qpersonelcontract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == personelcodeMain).OrderByDescending(c => c.numContractCode).Take(1).FirstOrDefault();
            if (qpersonelcontract != null)
            {
                dateCutWork = qpersonelcontract.dateCutWorkDate; //***

                qpersonelcontract.numStatus = 1;
                qpersonelcontract.dateCutWorkDate = qpersonelcontract.dateEndContractDate;

                //=========================================
                if (qpersonelcontract.numContractKindRef == 1 || qpersonelcontract.numContractKindRef == 3)
                {
                    var qpersonelmonth = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == personelcodeMain).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobCode).Take(1).FirstOrDefault();
                    if (qpersonelmonth != null)
                    {
                        qpersonelmonth.numStatus = 0;
                    }



                    //-----------------------------------
                    var qpreinvoice = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == personelcodeMain && c.numStatus == 3).FirstOrDefault();
                    if (qpreinvoice != null)
                    {
                        if ((qpreinvoice.numPriceEidi > 0 || qpreinvoice.numPriceEidi < 0) || (qpreinvoice.numPriceReBuyLeave > 0 || qpreinvoice.numPriceReBuyLeave < 0))
                            iseidi = "true";

                        PriceSaier = (int)qpreinvoice.numPriceSaier;
                        DescSaier = qpreinvoice.strDescSaier;

                        if (qpreinvoice.numPriceBuyCo > 0)
                        {
                            string[] arrayBuyCo = qpreinvoice.strBuyCoRef.Split(',').Where(c => !String.IsNullOrEmpty(c)).Distinct().ToArray(); 
                            var checkPadashAndJarimeh = office.ofcPersonelPadashAndJarimehs.Where(c => arrayBuyCo.Contains(c.numPadashCode.ToString()) && c.numPersonelRef==qpreinvoice.numPersonelRef && c.numStatus ==1);
                            foreach (var pp in checkPadashAndJarimeh) pp.numStatus = 0;
                        }

                        office.ofcPersonelPreInvoices.DeleteOnSubmit(qpreinvoice);
                    }
                }
                else if (qpersonelcontract.numContractKindRef == 2)
                {
                    var qpersonelmonth = office.ofcPersonelMonthlyJobSaatis.Where(c => c.numPersonelRef == personelcodeMain).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobSaatiCode).Take(1).FirstOrDefault();
                    if (qpersonelmonth != null)
                    {
                        qpersonelmonth.numStatus = 0;
                    }
                    //-----------------------------------
                    var qpreinvoice = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numPersonelRef == personelcodeMain && c.numStatus == 3).FirstOrDefault();
                    if (qpreinvoice != null)
                    {
                        if ((qpreinvoice.numPriceEidi > 0 || qpreinvoice.numPriceEidi < 0) || (qpreinvoice.numPriceReBuyLeave > 0 || qpreinvoice.numPriceReBuyLeave < 0))
                            iseidi = "true";

                        PriceSaier = (int)qpreinvoice.numPriceSaier;
                        DescSaier = qpreinvoice.strDescSaier;

                             if (qpreinvoice.numPriceBuyCo > 0)
                        {
                            string[] arrayBuyCo = qpreinvoice.strBuyCoRef.Split(',').Where(c => !String.IsNullOrEmpty(c)).Distinct().ToArray(); 
                            var checkPadashAndJarimeh = office.ofcPersonelPadashAndJarimehs.Where(c => arrayBuyCo.Contains(c.numPadashCode.ToString()) && c.numPersonelRef==qpreinvoice.numPersonelRef && c.numStatus ==1);
                            foreach (var pp in checkPadashAndJarimeh) pp.numStatus = 0;
                        }

                        office.ofcPersonelPreInvoiceSaatis.DeleteOnSubmit(qpreinvoice);
                    }
                }
                //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                var qendEidi = office.ofcPersonelEidiEndYears.Where(c => c.numPersonelRef == personelcodeMain && c.numStatus == 2).FirstOrDefault();
                if (qendEidi != null)
                    office.ofcPersonelEidiEndYears.DeleteOnSubmit(qendEidi);

                //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                var qendyear = office.ofcPersonelLeaveEndYears.Where(c => c.numPersonelRef == personelcodeMain && c.numStatus == 2).FirstOrDefault();
                if (qendyear != null)
                    office.ofcPersonelLeaveEndYears.DeleteOnSubmit(qendyear);

            }
            //................................................
            try
            {
                office.SubmitChanges();

                if (type == "2") ret = CalcCutwork(personelcodeMain, dateCutWork, iseidi, PriceSaier, DescSaier);
                ret = "1";// 
            }
            catch
            {
                ret = "2";// 
            }
        }

        return ret;
    }
    //---------------------------------------------------------------------------
    //------------------محاسبه مبلغ قطع همکاری----------------------------------
    //---------------------------------------------------------------------------
    private string CalcCutwork(int personelcode, string dateCutWork, string isEidi, int pricesaier, string descsaier)
    {
        string ret = "";
        string month = "", Year = "";
        int hoghoghpaie = 0, hoghoghPaie2 = 0, khalespardakhti = 0, sumkosor = 0, sumMandeHoghogh = 0;
        double maliatkarmand = 0, hoghogheBime = 0;
        int contractKind = 1;
        var q1 = office.ofcPersonels.Where(c => c.numPersonelCode == personelcode).FirstOrDefault();
        if (q1 != null)
        {
            // q1.numStatus = 3; // personel ghate hamkari

            var contract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == personelcode && c.numStatus == 1).FirstOrDefault();
            if (contract != null)
            {
                contract.dateCutWorkDate = dateCutWork;
                contract.numStatus = 0;
                contractKind = Convert.ToInt32(contract.numContractKindRef);
                if (contractKind == 1 || contractKind == 3) // movaghat and projecti
                {
                    var karkard = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobCode).Take(1).FirstOrDefault();
                    if (karkard != null)
                    {
                        karkard.numStatus = 1; // deactive karkard monthjob

                        month = karkard.numMonthJob.ToString();
                        Year = karkard.numYear.ToString();

                        int?[] arrayPersonlCutWork = (from t8 in office.ofcPersonelPreInvoices
                                                      join t9 in office.ofcPersonelMonthlyJobs on t8.numPersonelRef equals t9.numPersonelRef
                                                      where
                                                           (new int[] { 2 }).Contains((int)t8.numStatus)
                                                           &&
                                                           t8.strInvoiceMonth == month
                                                           &&
                                                           t8.strInvoiceYear == Year
                                                           &&
                                                           t9.numStatus == 0
                                                           &&
                                                           t8.numPersonelRef == personelcode
                                                      select t8.numPersonelRef).ToArray();
                        int?[] numpersonelarray = (from t8 in office.ofcPersonelPreInvoices
                                                   where
                                                        (new int[] { 2 }).Contains((int)t8.numStatus)
                                                        &&
                                                        t8.strInvoiceMonth == month
                                                        &&
                                                        t8.strInvoiceYear == Year
                                                        &&
                                                        !(arrayPersonlCutWork).Contains(t8.numPersonelRef)
                                                        &&
                                                        t8.numPersonelRef == personelcode
                                                   select t8.numPersonelRef).ToArray();
                        var q = (from t in office.ofcPersonels
                                 join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                                 join t2 in office.ofcPersonelMonthlyJobs on t1.numContractCode equals t2.numContractRef
                                 join t5 in office.ofcPersonelBankInfos on t.numPersonelCode equals t5.numPersonelRef into join_t5
                                 from t5 in join_t5.DefaultIfEmpty()
                                 join t7 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t7.numWorkGroupCode
                                 where
                                     t.numPersonelCode == personelcode
                                     &&
                                     t1.numStatus == 1
                                     &&
                                     t2.numStatus == 0
                                     &&
                                     (t2.numMonthJob == Convert.ToInt16(month))
                                     &&
                                     t2.numYear == Convert.ToInt16(Year)
                                     &&
                                     (t.numStatus == 2 || t.numStatus == 1)
                                     &&
                                     !
                                     (numpersonelarray).Contains(t.numPersonelCode)
                                 select new
                                 {
                                     //PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                                     numPersonelCode = Convert.ToInt32(t.numPersonelCode),
                                     cntchild = (office.ofcPersonelChildInfos.Where(c => c.numPersonelRef == t.numPersonelCode).Count()),
                                     t2.strJobDays,
                                     t2.strJobOverTime,
                                     t2.strJobOverTimeSpecial,
                                     t2.strJobOverTimeInMission,
                                     t2.numYear,
                                     numHoghoghSabetForEidi = (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary),
                                     numPersonelSalary = EdariFunc.GetPriceKarkardCutWork((int)t1.numPersonelSalary, t1.dateStartContractDate, dateCutWork, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), (int)t2.numContractKindRef, (int)t2.numPersonelRef, 1),
                                     numPersonelHomeSalary = (contractKind == 3 ? 0 : EdariFunc.GetPriceKarkardCutWork((int)t1.numPersonelHomeSalary, t1.dateStartContractDate, dateCutWork, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), (int)t2.numContractKindRef, (int)t2.numPersonelRef, 1)),
                                     numPersonelBon = (contractKind == 3 ? 0 : EdariFunc.GetPriceKarkardCutWork((int)t1.numPersonelBon, t1.dateStartContractDate, dateCutWork, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), (int)t2.numContractKindRef, (int)t2.numPersonelRef, 1)),
                                     ezafekar = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobOverTime, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 1, (int)t1.numContractCode, 0),
                                     ezafekarVijeh = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobOverTimeSpecial, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 1, (int)t1.numContractCode, 0),
                                     ezafekarinmission = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobOverTimeInMission, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 1, (int)t1.numContractCode, 0),
                                     jomekar = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobFriday, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 2, (int)t1.numContractCode, 0),
                                     tatilkar = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobHoliDay, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 3, (int)t1.numContractCode, 0),
                                     numPersonelChildSalary = EdariFunc.GetPriceKarkardCutWork((int)t1.numPersonelChildSalary, t1.dateStartContractDate, dateCutWork, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), (int)t2.numContractKindRef, (int)t2.numPersonelRef, 1),
                                     mamoriat = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobMission, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 4, (int)t1.numContractCode, 0),
                                     // numPersonelPadash = (contractKind == 3 ? EdariFunc.GetPriceFaraind((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, (int)t1.numPersonelPadash) : EdariFunc.GetPriceKarkardCutWork((int)t1.numPersonelPadash, t1.dateStartContractDate, dateCutWork, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), (int)t2.numContractKindRef, (int)t2.numPersonelRef, 1)),
                                     numPersonelPadash = EdariFunc.GetPriceKarkardCutWork((int)t1.numPersonelPadash, t1.dateStartContractDate, dateCutWork, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), (int)t2.numContractKindRef, (int)t2.numPersonelRef, 1),
                                     numPersonelSaier = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 1, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                                     eidi = EdariFunc.GetPriceEidi((int)t.numPersonelCode, (int)(contractKind == 3 ? 0 : t1.numPersonelSalary), t1.dateStartContractDate, dateCutWork, isEidi, Year),
                                     numPersonelSanavat = EdariFunc.GetPriceKarkardCutWork((int)t1.numPersonelSanavat, t1.dateStartContractDate, dateCutWork, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), (int)t2.numContractKindRef, (int)t2.numPersonelRef, 1),
                                     bimetakmili = 0,
                                     numPriceVamMontly = EdariFunc.GetMandeVamCutWork((int)t.numPersonelCode, 1),
                                     numPriceMosaede = EdariFunc.GetPriceMosaede((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob),
                                     takhir = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobDelay, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 5, (int)t1.numContractCode, 0),
                                     tajil = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobEarly, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 6, (int)t1.numContractCode, 0),
                                     ghibat = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobAbsent, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 7, (int)t1.numContractCode, 0),
                                     jarimeMotefareghe = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 2, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                                     strBankAccount = (t5.strBankAccount == null ? "-" : t5.strBankAccount),
                                     strBankName = ((t5.strBankName == null || t5.strBankName == "") ? "-" : t5.strBankName),
                                     t7.numWorkGroupCode,
                                     numVamCode = EdariFunc.GetMandeVamCutWork((int)t.numPersonelCode, 2),
                                     numMosaedeCode = EdariFunc.GetPriceMosaedeCode((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob),
                                     numPadashCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 1, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                                     numJarimehCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 2, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                                     khorojGhireMojaz = t2.strJobExit != null ? EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobExit, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 8, (int)t1.numContractCode, 0) : 0,

                                     bimehKarmand = EdariFunc.GetPriceKarkardBimeh2((int)t.numPersonelCode, (contractKind == 3 ? EdariFunc.GetPriceKarkardCutWork((int)BimehProjectAndSaati, t1.dateStartContractDate, dateCutWork, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), (int)t2.numContractKindRef, (int)t2.numPersonelRef, 2) : (int)EdariFunc.GetPriceKarkardCutWork((int)(t1.numPersonelSalary + t1.numPersonelHomeSalary + t1.numPersonelBon), t1.dateStartContractDate, dateCutWork, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), (int)t2.numContractKindRef, (int)t2.numPersonelRef, 2)), t1.dateStartContractDate, dateCutWork, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), (int)t1.numContractKindRef, 1),

                                     MorakhasiBiHoghogh = EdariFunc.GetPriceMorakhasiBiHoghogh((int)((contractKind == 3 ? hoghoghSabet : (t1.numPersonelSalary + t1.numPersonelHomeSalary + t1.numPersonelBon + t1.numPersonelPadash + t1.numPersonelChildSalary))), (int)t.numPersonelCode, t2.numMonthJob.ToString(), t2.numYear.ToString()),
                                     MorakhasiUniversal = EdariFunc.GetPriceMorakhasiUniversal((int)((contractKind == 3 ? hoghoghSabet : (t1.numPersonelSalary + t1.numPersonelHomeSalary + t1.numPersonelBon + t1.numPersonelPadash + t1.numPersonelChildSalary))), (int)t.numPersonelCode, t2.numMonthJob.ToString(), t2.numYear.ToString()),
                                     t1.numContractKindRef,
                                     t2.numContractRef,
                                     t2.numMonthlyJobCode,

                                     mandeHoghoghAzMaheGhabl = EdariFunc.GetMandeHoghoghAzMaheGhabl((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, dateCutWork, 2, 1),
                                     numPriceMoavaghe = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 3, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                                     numMoavagheCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 3, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),

                                     BazkharidMorakhasi = EdariFunc.GetPriceBazkharidMorakhasi((int)t.numPersonelCode, (contractKind == 3 || contractKind == 2 ? 0 : (int)t1.numPersonelSalary), (int)contractKind, isEidi, dateCutWork, 2, Year, 1).ToString(),

                                     AyabZahab = EdariFunc.GetAyabZahabCutWork((int)t.numPersonelCode, EdariFunc.CheckIsNUll(t1.numPriceAyabZahab, 0), t1.dateStartContractDate, dateCutWork, t2.numYear.ToString(), t2.numMonthJob.ToString(), (int)t1.numContractKindRef, 1),
                                     haghmodiriat = EdariFunc.GetHaghModiriatCutWork((int)t.numPersonelCode, EdariFunc.CheckIsNUll(t1.numPriceHaghModiriat, 0), t1.dateStartContractDate, t2.numYear.ToString(), t2.numMonthJob.ToString(), dateCutWork, (int)t1.numContractKindRef, 1),

                                     hazinejari = EdariFunc.GetHazinehJariCutWork((int)t.numPersonelCode, (int)t1.numPriceJariAbogaz, (int)t1.numPriceJariEjareh, (int)t1.numPriceJariNet, (int)t1.numPriceJariTel, t1.dateStartContractDate, dateCutWork, t2.numYear.ToString(), t2.numMonthJob.ToString(), (int)t1.numContractKindRef, 1),
                                     porsanttozi = EdariFunc.GetPorsantPriceAgentCutWork((int)t.numPersonelCode, (int)t1.numPricePorsantToziShode, t1.dateStartContractDate, dateCutWork, t2.numYear.ToString(), t2.numMonthJob.ToString(), (int)t1.numContractKindRef, 1, 1),
                                     porsantkharejmahdode = EdariFunc.GetPorsantPriceAgentCutWork((int)t.numPersonelCode, (int)t1.numPricePorsantKharejMahdode, t1.dateStartContractDate, dateCutWork, t2.numYear.ToString(), t2.numMonthJob.ToString(), (int)t1.numContractKindRef, 1, 2),
                                     porsantmoadeli = EdariFunc.GetPorsantPriceAgentCutWork((int)t.numPersonelCode, (int)t1.numPricePorsantMoadeli, t1.dateStartContractDate, dateCutWork, t2.numYear.ToString(), t2.numMonthJob.ToString(), (int)t1.numContractKindRef, 1, 3),

                                     kosormotefareghe = EdariFunc.GetPadashAndJarimehCutWork((int)t.numPersonelCode, (int)t1.numContractKindRef, 5,dateCutWork).ToString(),
                                     numkosormotefaregheCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 5, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),

                                     mah31roz = EdariFunc.GetPriceMonth29Or31CutWork((int)t.numPersonelCode, (int)(t1.numPersonelSalary), t1.dateStartContractDate, dateCutWork, t2.numYear.ToString(), t2.numMonthJob.ToString(), (int)t1.numContractKindRef, 1, 1),
                                     mah29roz = EdariFunc.GetPriceMonth29Or31CutWork((int)t.numPersonelCode, (int)(t1.numPersonelSalary), t1.dateStartContractDate, dateCutWork, t2.numYear.ToString(), t2.numMonthJob.ToString(), (int)t1.numContractKindRef, 1, 2),

                                     jarimehtakhir = EdariFunc.GetJarimehTakhir8HouerCutWork((int)t.numPersonelCode, (int)(contractKind == 3 ? hoghoghSabet : t2.numContractKindRef == 2 ? 0 : t1.numPersonelSalary), t1.dateStartContractDate, dateCutWork, t2.numYear.ToString(), t2.numMonthJob.ToString(), (int)t1.numContractKindRef, (int)t1.numContractCode, 5, 1),
                                     maliathoghogh = 0,

                                     kharid = EdariFunc.GetPadashAndJarimehCutWork((int)t.numPersonelCode, (int)t2.numContractKindRef, 4,dateCutWork).ToString(),
                                     numkharidCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 4, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),

                                 });

                        foreach (var item in q)
                        {
                            sumMandeHoghogh = 0;
                            if (item.mandeHoghoghAzMaheGhabl != "0")
                            {
                                sumMandeHoghogh = EdariFunc.GetPriceMandeHoghoghInSplit(item.mandeHoghoghAzMaheGhabl);

                            }
                            hoghoghpaie = Convert.ToInt32(item.numPersonelSalary) +
                                Convert.ToInt32(item.numPersonelHomeSalary) +
                                Convert.ToInt32(item.numPersonelBon);

                            hoghoghPaie2 = Convert.ToInt32(hoghoghpaie) +
                                           Convert.ToInt32(sumMandeHoghogh) +
                                           Convert.ToInt32(item.ezafekarVijeh) +
                                           Convert.ToInt32(item.ezafekarinmission) +
                                           Convert.ToInt32(item.jomekar) +
                                           Convert.ToInt32(item.ezafekar) +
                                           Convert.ToInt32(item.tatilkar) +
                                           Convert.ToInt32(item.AyabZahab) +
                                           Convert.ToInt32(item.haghmodiriat) +
                                           Convert.ToInt32(item.hazinejari) +
                                           Convert.ToInt32(item.porsanttozi) +
                                           Convert.ToInt32(item.porsantkharejmahdode) +
                                           Convert.ToInt32(item.porsantmoadeli) +
                                           Convert.ToInt32(item.BazkharidMorakhasi != "0" ? item.BazkharidMorakhasi.Split('^')[5] : "0") +
                                           Convert.ToInt32(item.mah31roz) +
                                           Convert.ToInt32(item.numPersonelChildSalary) +
                                           Convert.ToInt32(item.mamoriat) +
                                           Convert.ToInt32(item.numPersonelPadash) +
                                           Convert.ToInt32(item.numPriceMoavaghe) +
                                           Convert.ToInt32(item.numPersonelSaier) +
                                           Convert.ToInt32(item.eidi) +
                                           Convert.ToInt32(pricesaier) +
                                           Convert.ToInt32(item.numPersonelSanavat);
                            // maliatkarmand = hoghoghPaie2 > 11500000 ? hoghoghPaie2 * 0.1 : 0;
                            maliatkarmand = 0;
                            hoghogheBime = Convert.ToInt32(item.bimehKarmand);//Convert.ToInt32(item.numPersonelSalary + item.numPersonelHomeSalary + item.numPersonelBon);
                            hoghogheBime = (hoghogheBime * 0.07) * 1.1;
                            sumkosor = Convert.ToInt32(Math.Round(hoghogheBime)) +
                                       Convert.ToInt32(item.bimetakmili) +
                                       Convert.ToInt32(item.numPriceVamMontly) +
                                       Convert.ToInt32(item.jarimehtakhir) +
                                       Convert.ToInt32(item.numPriceMosaede) +
                                       Convert.ToInt32(item.takhir) +
                                       Convert.ToInt32(item.tajil) +
                                       Convert.ToInt32(item.ghibat) +
                                       Convert.ToInt32(item.jarimeMotefareghe) +
                                       Convert.ToInt32(item.khorojGhireMojaz) +
                                       Convert.ToInt32(item.MorakhasiBiHoghogh) +
                                       Convert.ToInt32(item.MorakhasiUniversal) +
                                       Convert.ToInt32(item.kharid) +
                                       Convert.ToInt32(item.kosormotefareghe) +
                                       Convert.ToInt32(item.maliathoghogh) +
                                       Convert.ToInt32(item.mah29roz);

                            khalespardakhti = hoghoghPaie2 - sumkosor;

                            office.ofcPersonelPreInvoices.InsertOnSubmit(new ofcPersonelPreInvoice
                            {
                                numPersonelRef = item.numPersonelCode,
                                numCntChild = item.cntchild,
                                strJobDays = item.strJobDays,
                                strJobOverTime = item.strJobOverTime,
                                numPersonelSalary = item.numPersonelSalary,
                                numPersonelHomeSalary = item.numPersonelHomeSalary,
                                numPersonelBon = item.numPersonelBon,
                                numPriceEzafeKar = item.ezafekar,
                                numPriceJomeKar = item.jomekar,
                                numPriceTatilKar = item.tatilkar,

                                numPriceCalcHoghogh1 = hoghoghpaie,
                                numPersonelChildSalary = item.numPersonelChildSalary,
                                numPriceMamoriat = item.mamoriat,
                                numPersonelPadash = item.numPersonelPadash,
                                numPersonelPadashSaier = item.numPersonelSaier,
                                numPersonelSanavat = item.numPersonelSanavat,
                                numPriceCalcHoghogh2 = hoghoghPaie2,
                                numPricePersonelBimeh = Convert.ToInt32(hoghogheBime),
                                numPriceBimeTakmili = item.bimetakmili,
                                numPriceVamMontly = Convert.ToInt32(item.numPriceVamMontly),
                                numPriceMosaede = item.numPriceMosaede,
                                numPriceTakhir = item.takhir,
                                numPriceTajil = item.tajil,
                                numPriceGhibat = item.ghibat,
                                numPriceJarimeMotefareghe = item.jarimeMotefareghe,
                                numPriceCalcHoghoghKhales = khalespardakhti,
                                strBankAccount = item.strBankAccount,
                                numWorkGroupCode = item.numWorkGroupCode,
                                strInvoiceMonth = month,
                                strInvoiceYear = Year,
                                dateRegisterDate = _PDate.PersianDate,
                                strRegisterUserRef = _ofcUser.strUserCode,
                                numStatus = 3, // pish sabt ghate hamkari
                                strVamRef = item.numVamCode.ToString(),
                                strMosaedeRef = item.numMosaedeCode,
                                strJarimehRef = item.numJarimehCode,
                                strPadashRef = item.numPadashCode,
                                numPriceKhorojGhireMojaz = item.khorojGhireMojaz,
                                dateVarizDate = _PDate.PersianDate,
                                numPriceMorakhasiBiHoghogh = Convert.ToInt32(item.MorakhasiBiHoghogh),
                                numPriceCalcKosorat = sumkosor,
                                numPriceMorakhasiUni = Convert.ToInt32(item.MorakhasiUniversal),
                                numContractKindRef = item.numContractKindRef,
                                numContractRef = item.numContractRef,
                                numMonthlyJobRef = item.numMonthlyJobCode,
                                numPriceSaier = Convert.ToInt32(pricesaier),
                                strBankName = item.strBankName,
                                strMandeAzMaheGhablTafkiki = item.mandeHoghoghAzMaheGhabl,
                                numPriceMoavaghe = item.numPriceMoavaghe,
                                strMoavagheRef = item.numMoavagheCode,
                                strDescSaier = descsaier.Trim(),
                                strJobOverTimeSpecial = item.strJobOverTimeSpecial,
                                numPriceEzafeKarVijeh = item.ezafekarVijeh,
                                strJobOverTimeInMission = item.strJobOverTimeInMission,
                                numPriceEzafeKarInMission = item.ezafekarinmission,
                                numPriceReBuyLeave = Convert.ToInt32(item.BazkharidMorakhasi != "0" ? item.BazkharidMorakhasi.Split('^')[5] : "0"),


                                numPriceBuyCo = Convert.ToInt32(item.kharid),
                                strBuyCoRef = item.numkharidCode,
                                numPriceGhoboz = Convert.ToInt32(item.hazinejari),
                                numPriceKosorMotefareghe = Convert.ToInt32(item.kosormotefareghe),
                                strKosorMotefaregheRef = item.numkosormotefaregheCode,

                                numPriceMonth29 = Convert.ToInt32(item.mah29roz),
                                numPriceMonth31 = Convert.ToInt32(item.mah31roz),
                                numPricePorsantKharjMahdode = Convert.ToInt32(item.porsantkharejmahdode),
                                numPricePorsantTozi = Convert.ToInt32(item.porsanttozi),
                                numPricePrintMoadeli = Convert.ToInt32(item.porsantmoadeli),

                                numPriceAyabzahab = Convert.ToInt32(item.AyabZahab),
                                numPriceHaghModiriat = Convert.ToInt32(item.haghmodiriat),
                                numPriceEidi = Convert.ToInt32(item.eidi),
                                numPricePersonelMaliat = Convert.ToInt32(maliatkarmand),
                                // numPriceBazkharidMorakhasi = Convert.ToInt32(item.BazkharidMorakhasi),
                                numPriceJarimehTakhir8Saat = Convert.ToInt32(item.jarimehtakhir),
                            });
                            //=========================================eidi===========================================
                            if (Convert.ToInt32(item.eidi) > 0)
                            {
                                string uniqcode = "";
                                Random rnd = new Random();

                                int day = (int)Math.Round((decimal)(Convert.ToInt32(item.eidi) / ((item.numHoghoghSabetForEidi * 2) / 365)));
                                uniqcode = _PDate.NowYear.Substring(2) + _PDate.NowMonth + item.numPersonelCode.ToString() + rnd.Next(1, 10).ToString();
                                office.ofcPersonelEidiEndYears.InsertOnSubmit(new ofcPersonelEidiEndYear
                                {
                                    numPersonelRef = item.numPersonelCode,
                                    numContractKindRef = item.numContractKindRef,
                                    numPriceRoot = item.numHoghoghSabetForEidi,
                                    numPriceEidiOneDay = (item.numHoghoghSabetForEidi / 365),
                                    numPriceSettleEidiEndYear = Convert.ToInt32(item.eidi),
                                    numWorkGroupCode = item.numWorkGroupCode,
                                    numYear = Convert.ToInt16(item.numYear),
                                    dateRegisterDate = _PDate.PersianDate,
                                    strRegisterUserRef = _ofcUser.strUserCode,
                                    numStatus = 2,
                                    numDayInYear = Convert.ToInt16(day),
                                    dateVerifiDate = _PDate.PersianDate,
                                    numIsLevelVariz = 1,
                                    numCountLevel = 1,
                                    strBankAccount = item.strBankAccount,
                                    strBankName = item.strBankName,
                                    strUniqCodeLevel = uniqcode

                                });
                            }
                            //=========================================bazkharid morakhasi===========================================
                            if (Convert.ToInt32(item.BazkharidMorakhasi != "0" ? item.BazkharidMorakhasi.Split('^')[5] : "0") != 0)
                            {
                                office.ofcPersonelLeaveEndYears.InsertOnSubmit(new ofcPersonelLeaveEndYear
                                {
                                    numPersonelRef = item.numPersonelCode,
                                    numContractKindRef = item.numContractKindRef,
                                    strCountLeaveInYear = item.BazkharidMorakhasi.Split('^')[0],
                                    strCountLeaveOut = item.BazkharidMorakhasi.Split('^')[1],
                                    strCountLeaveRemained = item.BazkharidMorakhasi.Split('^')[2],
                                    strCountPayableLeave = item.BazkharidMorakhasi.Split('^')[3],
                                    strCountPayOffLeave = item.BazkharidMorakhasi.Split('^')[4],
                                    numPriceRoot = (new int[] { 2, 3 }).Contains((int)item.numContractKindRef) ? Convert.ToInt32(item.BazkharidMorakhasi.Split('^')[6]) : Convert.ToInt32(item.numHoghoghSabetForEidi),
                                    numPriceSettleLeaveEndYear = Convert.ToInt32(item.BazkharidMorakhasi.Split('^')[5]),
                                    numWorkGroupCode = item.numWorkGroupCode,
                                    numYear = Convert.ToInt16(item.numYear),
                                    dateRegisterDate = _PDate.PersianDate,
                                    strRegisterUserRef = _ofcUser.strUserCode,
                                    numStatus = 2,
                                    dateVerifiDate = _PDate.PersianDate,
                                    strBankAccount = item.strBankAccount,
                                    strBankName = item.strBankName
                                });
                            }

                        }
                    }

                }
                else if (contractKind == 2) //saati
                {
                    var karkard = office.ofcPersonelMonthlyJobSaatis.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobSaatiCode).Take(1).FirstOrDefault();
                    if (karkard != null)
                    {
                        karkard.numStatus = 1;

                        month = karkard.numMonthJob.ToString();
                        Year = karkard.numYear.ToString();

                        int?[] arrayPersonlCutWork = (from t8 in office.ofcPersonelPreInvoiceSaatis
                                                      join t9 in office.ofcPersonelMonthlyJobSaatis on t8.numPersonelRef equals t9.numPersonelRef
                                                      where
                                                           (new int[] { 2 }).Contains((int)t8.numStatus)
                                                           &&
                                                           t8.strInvoiceMonth == month
                                                           &&
                                                           t8.strInvoiceYear == Year
                                                           &&
                                                           t9.numStatus == 0
                                                      select t8.numPersonelRef).ToArray();

                        int?[] numpersonelarray = (from t8 in office.ofcPersonelPreInvoiceSaatis
                                                   where
                                                        (new int[] { 0, 1, 2 }).Contains((int)t8.numStatus)
                                                        &&
                                                        t8.strInvoiceMonth == month
                                                        &&
                                                        t8.strInvoiceYear == Year
                                                        &&
                                                        !(arrayPersonlCutWork).Contains(t8.numPersonelRef)
                                                   select t8.numPersonelRef).ToArray();
                        var q = (from t in office.ofcPersonels
                                 join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                                 join t2 in office.ofcPersonelMonthlyJobSaatis on t1.numContractCode equals t2.numContractRef
                                 join t5 in office.ofcPersonelBankInfos on t.numPersonelCode equals t5.numPersonelRef into join_t5
                                 from t5 in join_t5.DefaultIfEmpty()
                                 join t7 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t7.numWorkGroupCode
                                 where
                                      t.numPersonelCode == personelcode
                                      &&
                                      t1.numStatus == 1
                                      &&
                                      t2.numStatus == 0
                                      &&
                                      t1.numContractKindRef == contractKind
                                      &&
                                      (t2.numMonthJob == Convert.ToInt16(month))
                                      &&
                                      t2.numYear == Convert.ToInt16(Year)
                                      &&
                                      (t.numStatus == 2 || t.numStatus == 1)
                                      &&
                                      !
                                      (numpersonelarray).Contains(t.numPersonelCode)
                                 select new
                                 {
                                     PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                                     numPersonelCode = t.numPersonelCode,
                                     strJobTime = t2.strJobTime,
                                     t2.numYear,
                                     numPersonelSalary1 = t1.numPersonelSalary,
                                     numPersonelSalary = EdariFunc.GetPriceKarkardSaati(t2.strJobTime, (int)t1.numPersonelSalary, 1),
                                     numPersonelSaier = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 1, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                                     bimehKarmand = EdariFunc.GetPriceKarkardBimeh2((int)t.numPersonelCode, EdariFunc.GetPriceKarkardCutWork((int)BimehProjectAndSaati, t1.dateStartContractDate, dateCutWork, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), (int)t1.numContractKindRef, (int)t1.numPersonelRef, 2), t1.dateStartContractDate, dateCutWork, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), (int)t1.numContractKindRef, 1),
                                     bimetakmili = 0,
                                     numPriceVamMontly = EdariFunc.GetMandeVamCutWork((int)t.numPersonelCode, 1),
                                     numPriceMosaede = EdariFunc.GetPriceMosaede((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob),
                                     jarimeMotefareghe = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 2, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                                     strBankAccount = (t5.strBankAccount == null ? "-" : t5.strBankAccount),
                                     strBankName = ((t5.strBankName == null || t5.strBankName == "") ? "-" : t5.strBankName),
                                     strWorkGroupName = t7.strWorkGroupName,
                                     numWorkGroupCode = t7.numWorkGroupCode,
                                     numVamCode = EdariFunc.GetMandeVamCutWork((int)t.numPersonelCode, 2),
                                     numMosaedeCode = EdariFunc.GetPriceMosaedeCode((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob),
                                     numPadashCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 1, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                                     numJarimehCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 2, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                                     numContractKindRef = t1.numContractKindRef,
                                     numContractRef = t2.numContractRef,
                                     numMonthlyJobSaatiCode = t2.numMonthlyJobSaatiCode,

                                     mandeHoghoghAzMaheGhabl = "0",// EdariFunc.GetMandeHoghoghAzMaheGhabl((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, dateCutWork, 2, 0),

                                     numPriceMoavaghe = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 3, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                                     numMoavagheCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 3, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                                     eidi = EdariFunc.GetPriceEidi((int)t.numPersonelCode, 0, t1.dateStartContractDate, dateCutWork, isEidi, Year),
                                     BazkharidMorakhasi = EdariFunc.GetPriceBazkharidMorakhasi((int)t.numPersonelCode, 0, (int)contractKind, isEidi, dateCutWork, 2, Year, 1).ToString(),


                                     AyabZahab = EdariFunc.GetAyabZahabCutWork((int)t.numPersonelCode, EdariFunc.CheckIsNUll(t1.numPriceAyabZahab, 0), t1.dateStartContractDate, dateCutWork, t2.numYear.ToString(), t2.numMonthJob.ToString(), (int)t1.numContractKindRef, 1),
                                     kosormotefareghe = EdariFunc.GetPadashAndJarimehCutWork((int)t.numPersonelCode, (int)t1.numContractKindRef, 5,dateCutWork).ToString(),
                                     numkosormotefaregheCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 5, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                                     mah29roz = EdariFunc.GetPriceMonth29Or31CutWork((int)t.numPersonelCode, (int)(t1.numPersonelSalary), t1.dateStartContractDate, dateCutWork, t2.numYear.ToString(), t2.numMonthJob.ToString(), (int)t1.numContractKindRef, 1, 2),

                                     kharid = EdariFunc.GetPadashAndJarimehCutWork((int)t.numPersonelCode, (int)t2.numContractKindRef, 4,dateCutWork).ToString(),
                                     numkharidCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 4, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),

                                     maliathoghogh = 0,
                                 });
                        hoghoghpaie = 0; khalespardakhti = 0; sumkosor = 0; sumMandeHoghogh = 0;
                        maliatkarmand = 0; hoghogheBime = 0;
                        foreach (var item in q)
                        {
                            sumMandeHoghogh = 0;
                            if (item.mandeHoghoghAzMaheGhabl != "0")
                            {
                                sumMandeHoghogh = EdariFunc.GetPriceMandeHoghoghInSplit(item.mandeHoghoghAzMaheGhabl);

                            }
                            hoghoghpaie = Convert.ToInt32(item.numPersonelSalary) +
                                          Convert.ToInt32(item.numPersonelSaier) +
                                          Convert.ToInt32(sumMandeHoghogh) +
                                          Convert.ToInt32(item.numPriceMoavaghe) +
                                          Convert.ToInt32(pricesaier) +
                                          Convert.ToInt32(item.AyabZahab);

                            // maliatkarmand = hoghoghPaie2 > 11500000 ? hoghoghPaie2 * 0.1 : 0;
                            maliatkarmand = 0;
                            hoghogheBime = item.bimehKarmand;//Convert.ToInt32(item.numPersonelSalary + item.numPersonelHomeSalary + item.numPersonelBon);
                            hoghogheBime = (hoghogheBime * Convert.ToDouble(0.07)) * Convert.ToDouble(1.1);

                            sumkosor = Convert.ToInt32(Math.Round(hoghogheBime)) +
                                       Convert.ToInt32(item.bimetakmili) +
                                       Convert.ToInt32(item.numPriceVamMontly) +
                                       Convert.ToInt32(item.numPriceMosaede) +
                                       Convert.ToInt32(item.jarimeMotefareghe) +
                                       Convert.ToInt32(item.kharid) +
                                       Convert.ToInt32(item.kosormotefareghe) +
                                       Convert.ToInt32(item.maliathoghogh);

                            khalespardakhti = hoghoghpaie - sumkosor;

                            office.ofcPersonelPreInvoiceSaatis.InsertOnSubmit(new ofcPersonelPreInvoiceSaati
                            {
                                numPersonelRef = item.numPersonelCode,
                                strJobTime = item.strJobTime,
                                numPriceSaati = item.numPersonelSalary1,
                                numPersonelSalary = item.numPersonelSalary,
                                numPriceCalcHoghogh1 = hoghoghpaie,
                                numPersonelPadashSaier = item.numPersonelSaier,
                                numPricePersonelMaliat = Convert.ToInt32(maliatkarmand),
                                numPricePersonelBimeh = Convert.ToInt32(hoghogheBime),
                                numPriceBimeTakmili = item.bimetakmili,
                                numPriceVamMontly = Convert.ToInt32(item.numPriceVamMontly),
                                numPriceMosaede = item.numPriceMosaede,
                                numPriceJarimeMotefareghe = item.jarimeMotefareghe,
                                numPriceCalcHoghoghKhales = khalespardakhti,
                                strBankAccount = item.strBankAccount,
                                numWorkGroupCode = item.numWorkGroupCode,
                                strInvoiceMonth = month,
                                strInvoiceYear = Year,
                                dateRegisterDate = _PDate.PersianDate,
                                strRegisterUserRef = _ofcUser.strUserCode,
                                numStatus = 3, // pish sabt ghate hamkari
                                strVamRef = item.numVamCode,
                                strMosaedeRef = item.numMosaedeCode,
                                strJarimehRef = item.numJarimehCode,
                                strPadashRef = item.numPadashCode,
                                numPriceCalcKosorat = sumkosor,
                                numContractKindRef = item.numContractKindRef,
                                numContractRef = item.numContractRef,
                                numMonthlyJobSaatiRef = item.numMonthlyJobSaatiCode,
                                strBankName = item.strBankName,
                                strMandeAzMaheGhablTafkiki = item.mandeHoghoghAzMaheGhabl,
                                numPriceMoavaghe = item.numPriceMoavaghe,
                                strMoavagheRef = item.numMoavagheCode,
                                numPriceSaier = Convert.ToInt32(pricesaier),
                                strDescSaier = descsaier.Trim(),
                                dateVarizDate = _PDate.PersianDate,
                                numPriceEidi = Convert.ToInt32(item.eidi),
                                numPriceReBuyLeave = Convert.ToInt32(item.BazkharidMorakhasi != "0" ? item.BazkharidMorakhasi.Split('^')[5] : "0"),

                                numPriceAyabzahab = Convert.ToInt32(item.AyabZahab),
                                numPriceKosorMotefareghe = Convert.ToInt32(item.kosormotefareghe),
                                strKosorMotefaregheRef = item.numkosormotefaregheCode,

                                numPriceBuyCo = Convert.ToInt32(item.kharid),
                                strBuyCoRef = item.numkharidCode

                            });
                            //=========================================eidi===========================================
                            if (Convert.ToInt32(item.eidi) > 0)
                            {
                                string datefrom = _PDate.NowYear + "/01/01", dateto = _PDate.NowYear + "/12/31";
                                var contractcheck = (from t in office.ofcPersonelContracts
                                                     orderby t.numContractCode descending
                                                     where
                                                           (t.numContractKindRef == 1 || t.numContractKindRef == 3)
                                                           &&
                                                           t.numPersonelRef == personelcode
                                                           &&
                                                          (string.Compare(t.dateStartContractDate.Trim(), datefrom.Trim()) >= 0 && string.Compare(t.dateStartContractDate.Trim(), dateto.Trim()) <= 0)
                                                     select new
                                                     {
                                                         numPersonelSalary = (t.numContractKindRef == 3 ? hoghoghSabet : t.numPersonelSalary),
                                                         t.numContractCode
                                                     }).Take(1).FirstOrDefault();

                                if (contractcheck != null)
                                {
                                    int day = (int)Math.Round((decimal)(Convert.ToInt32(item.eidi) / ((contractcheck.numPersonelSalary * 2) / 365)));
                                    office.ofcPersonelEidiEndYears.InsertOnSubmit(new ofcPersonelEidiEndYear
                                    {
                                        numPersonelRef = item.numPersonelCode,
                                        numContractKindRef = item.numContractKindRef,
                                        numPriceRoot = contractcheck.numPersonelSalary,
                                        numPriceEidiOneDay = (contractcheck.numPersonelSalary / 365),
                                        numPriceSettleEidiEndYear = Convert.ToInt32(item.eidi),
                                        numWorkGroupCode = item.numWorkGroupCode,
                                        numYear = Convert.ToInt16(item.numYear),
                                        dateRegisterDate = _PDate.PersianDate,
                                        strRegisterUserRef = _ofcUser.strUserCode,
                                        numStatus = 2,
                                        numDayInYear = Convert.ToInt16(day),
                                    });
                                }
                            }
                            //=========================================bazkharid morakhasi===========================================
                            if (Convert.ToInt32(item.BazkharidMorakhasi != "0" ? item.BazkharidMorakhasi.Split('^')[5] : "0") > 0)
                            {
                                office.ofcPersonelLeaveEndYears.InsertOnSubmit(new ofcPersonelLeaveEndYear
                                {
                                    numPersonelRef = item.numPersonelCode,
                                    numContractKindRef = item.numContractKindRef,
                                    strCountLeaveInYear = item.BazkharidMorakhasi.Split('^')[0],
                                    strCountLeaveOut = item.BazkharidMorakhasi.Split('^')[1],
                                    strCountLeaveRemained = item.BazkharidMorakhasi.Split('^')[2],
                                    strCountPayableLeave = item.BazkharidMorakhasi.Split('^')[3],
                                    strCountPayOffLeave = item.BazkharidMorakhasi.Split('^')[4],
                                    numPriceRoot = Convert.ToInt32(item.BazkharidMorakhasi.Split('^')[6]),
                                    numPriceSettleLeaveEndYear = Convert.ToInt32(item.BazkharidMorakhasi.Split('^')[5]),
                                    numWorkGroupCode = item.numWorkGroupCode,
                                    numYear = Convert.ToInt16(item.numYear),
                                    dateRegisterDate = _PDate.PersianDate,
                                    strRegisterUserRef = _ofcUser.strUserCode,
                                    numStatus = 2,
                                    dateVerifiDate = _PDate.PersianDate,
                                });
                            }
                            //====================================================================================
                        }

                    }
                }
            }
        }

        try
        {
            office.SubmitChanges();
            ret = "1";// 
        }
        catch
        {
            ret = "2";// 
        }

        return ret;

    }
    //---------------------------------------------------------------------------
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}