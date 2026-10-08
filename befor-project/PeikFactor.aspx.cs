using Stimulsoft.Report;
using Stimulsoft.Report.Export;
using Stimulsoft.Report.Web;
using System;
using System.Data;
using System.IO;
using System.Linq;
using System.Web.UI;
using System.Collections.Generic;
using System.Data.Linq;

public partial class PeikFactor : System.Web.UI.Page
{
    ofcUser _ofcUser;
    Function func = new Function();
    h8.h8 _h8 = new h8.h8();
    OfficeDataContext office;
    //int BimehProjectAndSaati = 0; // 9421645; // hoghogh sabet + bon + hagh maskan sale  95
    int hoghoghSabet = 0; // hoghogh sabete sale 95
    FuncAllEdari EdariFunc = new FuncAllEdari();
    //--------------------------------------------------------------------------------
    private void SetTitlePage(string title)
    {
        Page.Title = "اداری | " + title.Trim();
    }
    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["Office"] == null) Response.Redirect("login.aspx"); else _ofcUser = (ofcUser)Session["Office"];
        SetTitlePage("خروجی پرینت");
        if (func.CheckUserAccess("9", _ofcUser.strUserCode) == "-1")
        {
            Response.Redirect("AccessDenied.htm");
        }
        //BimehProjectAndSaati = func.BimehProjectAndSaati;
        hoghoghSabet = func.hoghoghSabet;
        if (!IsPostBack)
        {
            office = new OfficeDataContext(func.Officecstr.Trim());

            string PersonelCode = Request.QueryString["ofc"];
            string PersonelCodePrint = Request.QueryString["ofcPr"];
            string PersonelCutWorkPrint = Request.QueryString["ofcutwork"];
            string PersonelFishPrint = Request.QueryString["ofcFish"];
            string PersonelFaraiandPrint = Request.QueryString["ofcFaraiand"];
            string PersonelEidiPrint = Request.QueryString["ofcEidi"];
            string PersonelMorakhasiPrint = Request.QueryString["ofcMorakhasi"];

            if (PersonelCode != null)
                GetContractPersonel();
            else if (PersonelCodePrint != null)
                GetPrintAllHoghoghPersonel();
            else if (PersonelCutWorkPrint != null)
                GetInfoCutWork();
            else if (PersonelFishPrint != null)
                GetInfoFishHoghogh();
            else if (PersonelFaraiandPrint != null)
                GetInfoPersonelFaraiand();
            else if (PersonelEidiPrint != null)
                GetInfoPersonelEidi();
            else if (PersonelMorakhasiPrint != null)
                GetInfoPersonelMorakhasi();
        }
    }
    //---------------------------------------------------------------------------
    //--------------------------------قرارداد پرسنل-----------------------------
    //---------------------------------------------------------------------------
    private void GetContractPersonel()
    {
        string contractcode = Request.QueryString["ofc"];
        if (contractcode != null)
        {
            //======================================= movaghat ===============================================
            List<rwInfoContract1> lstMovaghat = new List<rwInfoContract1>();
            IMultipleResults result1 = office.GetInfoContractForPrint(contractcode, 1);
            lstMovaghat = result1.GetResult<rwInfoContract1>().ToList();
            //============================================= saati ===================================
            List<rwInfoContract2> lstSaati = new List<rwInfoContract2>();
            IMultipleResults result2 = office.GetInfoContractForPrint(contractcode, 2);
            lstSaati = result2.GetResult<rwInfoContract2>().ToList();
            //============================================= project setadi ===================================
            List<rwInfoContract3> lstProject = new List<rwInfoContract3>();
            IMultipleResults result3 = office.GetInfoContractForPrint(contractcode, 3);
            lstProject = result3.GetResult<rwInfoContract3>().ToList();
            //============================================= project hamlo naghl - agent===================================
            List<rwInfoContract4> lstAgent = new List<rwInfoContract4>();
            IMultipleResults result4 = office.GetInfoContractForPrint(contractcode, 4);
            lstAgent = result4.GetResult<rwInfoContract4>().ToList();
            //============================================= project hamlo naghl - peik===================================
            List<rwInfoContract5> lstPeik = new List<rwInfoContract5>();
            IMultipleResults result5 = office.GetInfoContractForPrint(contractcode, 5);
            lstPeik = result5.GetResult<rwInfoContract5>().ToList();
            //============================================= project Info Zemanat ===================================
            List<rwZemanatInfoAll> lstZemanatInfoAll = new List<rwZemanatInfoAll>();
            List<rwZemanatCheckDetails> lstZemanatInfoCheckDetails = new List<rwZemanatCheckDetails>();
            List<rwZemanatSaftehDetails> lstZemanatInfoSeftehDetails = new List<rwZemanatSaftehDetails>();
            IMultipleResults result6 = office.GetInfoContractForPrint(contractcode, 6);
            lstZemanatInfoAll = result6.GetResult<rwZemanatInfoAll>().ToList();
            lstZemanatInfoCheckDetails = result6.GetResult<rwZemanatCheckDetails>().ToList();
            lstZemanatInfoSeftehDetails = result6.GetResult<rwZemanatSaftehDetails>().ToList();
            //============================================= project hamlo naghl - peik===================================
            List<rwPriceContract> lstprice = new List<rwPriceContract>();
            IMultipleResults result7 = office.GetInfoContractForPrint(contractcode, 7);
            lstprice = result7.GetResult<rwPriceContract>().ToList();
            //============================================================================================================
            StiReport oRep = new StiReport();
            oRep.Load(Server.MapPath("~/Reports/PersonelContract.mrt"));
            oRep.RegData("PersonelDataSetMovaghat", lstMovaghat);
            oRep.RegData("PersonelDataSetSaati", lstSaati);
            oRep.RegData("PersonelDataSetProject", lstProject);
            oRep.RegData("PersonelDataSetProjectAgent", lstAgent);
            oRep.RegData("PersonelDataSetProjectPeik", lstPeik);

            oRep.RegData("PersonelZemantInfoAll", lstZemanatInfoAll);
            oRep.RegData("PersonelZemanatCheckDetails", lstZemanatInfoCheckDetails);
            oRep.RegData("PersonelZemanatSaftehDetails", lstZemanatInfoSeftehDetails);

            oRep.RegData("PersonelGetPrice", lstprice);

            oRep.CacheAllData = true;
            oRep.Dictionary.Synchronize();
            oRep.Render(false);

            StiPdfExportSettings pdfexport = new StiPdfExportSettings();
            pdfexport.ImageQuality = 1f;
            pdfexport.ImageResolution = 300;
            pdfexport.Compressed = true;
            pdfexport.ImageCompressionMethod = StiPdfImageCompressionMethod.Flate;
            StiReportResponse.ResponseAsPdf(this, oRep, false, pdfexport);
        }
    }

    //---------------------------------------------------------------------------
    //---------------------پرینت صورت حساب حقوق کارمندان-----------------------
    //---------------------------------------------------------------------------
    private void GetPrintAllHoghoghPersonel()
    {
        string invoiceCode = Request.QueryString["ofcPr"];
        if (invoiceCode != null)
        {
            string itemserach = Request.QueryString["itemsearch"];
            string month = itemserach.Split(',')[0];
            string year = itemserach.Split(',')[1];
            string contractKind = itemserach.Split(',')[2];
            string[] arrayinvoiceCode = invoiceCode.Split(',');
            //======================================================================================
            StiReport oRep = new StiReport();
            if (contractKind == "1" || contractKind == "3")
            {
                var linq = (from t in office.ofcPersonelPreInvoices
                            join t1 in office.ofcBWorkGroups on t.numWorkGroupCode equals t1.numWorkGroupCode
                            join t2 in office.ofcPersonels on t.numPersonelRef equals t2.numPersonelCode
                            where
                                 arrayinvoiceCode.Contains(t.numInvoiceCode.ToString())
                                 &&
                                 t.numStatus == 0
                                 &&
                                 t.numContractKindRef == Convert.ToInt32(contractKind)
                            orderby t.numPersonelRef
                            select new
                            {
                                Name = t2.strPersonelName + " " + t2.strPersonelFamily,
                                PersonelCode = t2.numPersonelCode.ToString(),
                                CntChild = t.numCntChild.ToString(),
                                Rozkarkard = t.strJobDays,
                                TimeEzafeKar = t.strJobOverTime,
                                TimeEzafeKarVijeh = t.strJobOverTimeSpecial,
                                TimeEzafeKarInMission = t.strJobOverTimeInMission,

                                HoghoghSabet = t.numPersonelSalary.ToString(),
                                HaghMaskan = t.numPersonelHomeSalary.ToString(),
                                BonKharobar = t.numPersonelBon.ToString(),
                                EzafeKar = t.numPriceEzafeKar.ToString(),
                                EzafeKarVijeh = t.numPriceEzafeKarVijeh.ToString(),
                                EzafeKarInMission = t.numPriceEzafeKarInMission.ToString(),

                                JomeKar = t.numPriceJomeKar.ToString(),
                                TatilKar = t.numPriceTatilKar.ToString(),
                                ayabzahab = t.numPriceAyabzahab.ToString(),
                                haghmodiriat = t.numPriceHaghModiriat.ToString(),
                                HoghoghPaie1 = t.numPriceCalcHoghogh1.ToString(),
                                HaghOlad = t.numPersonelChildSalary.ToString(),
                                Mamoriat = t.numPriceMamoriat.ToString(),
                                PadashAmalkard = t.numPersonelPadash.ToString(),
                                PadshSaier = t.numPersonelPadashSaier.ToString(),
                                Eidi = t.numPriceEidi.ToString(),
                                Sanavat = t.numPersonelSanavat.ToString(),
                                HoghoghPaie2 = t.numPriceCalcHoghogh2.ToString(),
                                bimehTakmili = t.numPriceBimeTakmili.ToString(),
                                Maliat = t.numPricePersonelMaliat.ToString(),
                                BimehKarmand = t.numPricePersonelBimeh.ToString(),
                                GhestVam = t.numPriceVamMontly.ToString(),
                                Mosaede = t.numPriceMosaede.ToString(),
                                Takhir = t.numPriceTakhir.ToString(),
                                Tajil = t.numPriceTajil.ToString(),
                                Ghibat = t.numPriceGhibat.ToString(),
                                jarimehMotefareghe = t.numPriceJarimeMotefareghe.ToString(),
                                KhorojGhireMojaz = t.numPriceKhorojGhireMojaz.ToString(),
                                ShomareHesab = t.strBankAccount,
                                WorkGroup = t1.strWorkGroupName,
                                KhalesPardakhti = t.numPriceCalcHoghoghKhales.ToString(),
                                MonthName = EdariFunc.GetMonthName(t.strInvoiceMonth),
                                Year = t.strInvoiceYear,
                                SumKosorat = t.numPriceCalcKosorat.ToString(),
                                MorakhasiBiHoghogh = t.numPriceMorakhasiBiHoghogh.ToString(),
                                MorakhasiUni = t.numPriceMorakhasiUni.ToString(),
                                BankName = t.strBankName,
                                MandeAzMaheGhabl = EdariFunc.GetPriceMandeHoghoghInSplit(t.strMandeAzMaheGhablTafkiki).ToString(),
                                numPriceMoavaghe = t.numPriceMoavaghe.ToString(),
                                kharid = t.numPriceBuyCo.ToString(),


                                numPriceHaghModiriat = t.numPriceHaghModiriat.ToString(),
                                numPriceAyabzahab = t.numPriceAyabzahab.ToString(),
                                numPriceGhoboz = t.numPriceGhoboz.ToString(),
                                numPricePorsantTozi = t.numPricePorsantTozi.ToString(),
                                numPricePorsantKharjMahdode = t.numPricePorsantKharjMahdode.ToString(),
                                numPricePrintMoadeli = t.numPricePrintMoadeli.ToString(),
                                numPriceMonth31 = t.numPriceMonth31.ToString(),

                                numPriceKosorMotefareghe = t.numPriceKosorMotefareghe.ToString(),
                                numPriceJarimehTakhir8Saat = t.numPriceJarimehTakhir8Saat.ToString(),
                                numPriceMonth29 = t.numPriceMonth29.ToString(),
                                numPricePersonelMaliat = t.numPricePersonelMaliat.ToString(),
                                numPriceBazkharidMorakhasi = t.numPriceReBuyLeave.ToString(),

                                imagelogo = t.numWorkGroupCode == 1 || t.numWorkGroupCode == 3 ? "http://edari.abnama24.ir/images/logofoctor.png" : t.numWorkGroupCode == 2 ? "http://edari.abnama24.ir/images/shixonlogo.png" : t.numWorkGroupCode == 4 ? "http://edari.abnama24.ir/images/memarketlogo.png" : "http://edari.abnama24.ir/images/logofoctor.png",

                            });
                string workgroupTemp = "";
                if (linq.Count() > 0)
                {

                    var q = linq.Select(c => c.WorkGroup).Distinct();
                    int cntall = office.ofcBWorkGroups.Select(c => c.numWorkGroupCode).Count();
                    if (q.Count() == cntall)
                    {
                        workgroupTemp = "همه گروه ها";
                    }
                    else
                    {
                        foreach (var item in q)
                        {
                            if (workgroupTemp == "")
                                workgroupTemp = item;
                            else
                                workgroupTemp = workgroupTemp + "," + item;
                        }
                    }
                    if (contractKind == "1")
                        oRep.Load(Server.MapPath("~/Reports/PersonelHoghogh.mrt"));
                    else if (contractKind == "3")
                        oRep.Load(Server.MapPath("~/Reports/PersonelHoghoghProject.mrt"));


                    oRep.Dictionary.Variables["lblWorkGroup"].Value = workgroupTemp.Trim();
                    oRep.RegData("PrintInvoice", linq);
                    oRep.Dictionary.Synchronize();
                    oRep.Render(false);

                    StiPdfExportSettings pdfexport = new StiPdfExportSettings();
                    pdfexport.ImageQuality = 1f;
                    pdfexport.ImageResolution = 300;
                    pdfexport.Compressed = true;
                    pdfexport.ImageCompressionMethod = StiPdfImageCompressionMethod.Flate;
                    StiReportResponse.ResponseAsPdf(this, oRep, false, pdfexport);
                }

            }
            else if (contractKind == "2")
            {
                var linq = (from t in office.ofcPersonelPreInvoiceSaatis
                            join t1 in office.ofcBWorkGroups on t.numWorkGroupCode equals t1.numWorkGroupCode
                            join t2 in office.ofcPersonels on t.numPersonelRef equals t2.numPersonelCode
                            where
                                 arrayinvoiceCode.Contains(t.numInvoiceSaatiCode.ToString())
                                 &&
                                 t.numStatus == 0
                                 &&
                                 t.numContractKindRef == Convert.ToInt32(contractKind)
                            orderby t.numPersonelRef
                            select new
                            {
                                Name = t2.strPersonelName + " " + t2.strPersonelFamily,
                                PersonelCode = t2.numPersonelCode.ToString(),
                                HoghoghSabet = t.numPersonelSalary.ToString(),
                                PadshSaier = t.numPersonelPadashSaier.ToString(),
                                HoghoghPaie1 = t.numPriceCalcHoghogh1.ToString(),
                                bimehTakmili = t.numPriceBimeTakmili.ToString(),
                                Maliat = t.numPricePersonelMaliat.ToString(),
                                BimehKarmand = t.numPricePersonelBimeh.ToString(),
                                GhestVam = t.numPriceVamMontly.ToString(),
                                Mosaede = t.numPriceMosaede.ToString(),
                                jarimehMotefareghe = t.numPriceJarimeMotefareghe.ToString(),
                                ShomareHesab = t.strBankAccount,
                                WorkGroup = t1.strWorkGroupName,
                                KhalesPardakhti = t.numPriceCalcHoghoghKhales.ToString(),
                                MonthName = EdariFunc.GetMonthName(t.strInvoiceMonth),
                                Year = t.strInvoiceYear,
                                SumKosorat = t.numPriceCalcKosorat.ToString(),
                                BankName = t.strBankName,
                                MandeAzMaheGhabl = EdariFunc.GetPriceMandeHoghoghInSplit(t.strMandeAzMaheGhablTafkiki).ToString(),
                                numPriceMoavaghe = t.numPriceMoavaghe.ToString(),
                                kharid = t.numPriceBuyCo.ToString(),

                                numPricePersonelMaliat = t.numPricePersonelMaliat.ToString(),
                                numPriceKosorMotefareghe = t.numPriceKosorMotefareghe.ToString(),
                                numPriceAyabzahab = t.numPriceAyabzahab.ToString(),

                                imagelogo = t.numWorkGroupCode == 1 || t.numWorkGroupCode == 3 ? "http://edari.abnama24.ir/images/logofoctor.png" : t.numWorkGroupCode == 2 ? "http://edari.abnama24.ir/images/shixonlogo.png" : t.numWorkGroupCode == 4 ? "http://edari.abnama24.ir/images/memarketlogo.png" : "http://edari.abnama24.ir/images/logofoctor.png",


                            });
                // int a = linq.Count();

                string workgroupTemp = "";
                //int contractcode = 0;
                if (linq.Count() > 0)
                {
                    // contractcode = Convert.ToInt32(office.ofcPersonelPreInvoices.Where(c => arrayinvoiceCode.Contains(c.numInvoiceCode.ToString())).FirstOrDefault().numContractKindRef);

                    var q = linq.Select(c => c.WorkGroup).Distinct();
                    int cntall = office.ofcBWorkGroups.Select(c => c.numWorkGroupCode).Count();
                    if (q.Count() == cntall)
                    {
                        workgroupTemp = "همه گروه ها";
                    }
                    else
                    {
                        foreach (var item in q)
                        {
                            if (workgroupTemp == "")
                                workgroupTemp = item;
                            else
                                workgroupTemp = workgroupTemp + "," + item;
                        }
                    }
                    if (contractKind == "2")
                        oRep.Load(Server.MapPath("~/Reports/PersonelHoghoghSaati.mrt"));

                    oRep.Dictionary.Variables["lblWorkGroup"].Value = workgroupTemp.Trim();
                    oRep.RegData("PrintInvoice", linq);
                    oRep.Dictionary.Synchronize();
                    oRep.Render(false);

                    StiPdfExportSettings pdfexport = new StiPdfExportSettings();
                    pdfexport.ImageQuality = 1f;
                    pdfexport.ImageResolution = 300;
                    pdfexport.Compressed = true;
                    pdfexport.ImageCompressionMethod = StiPdfImageCompressionMethod.Flate;
                    StiReportResponse.ResponseAsPdf(this, oRep, false, pdfexport);
                }
            }
        }
    }
    //---------------------------------------------------------------------------
    //-------------------------پرینت فرم قطع همکاری پرسنل ---------------------
    //---------------------------------------------------------------------------
    string arrayCutWork = "";
    private void GetInfoCutWork()
    {
        string PersonelCodePrint = Request.QueryString["ofcutwork"];
        if (PersonelCodePrint != null)
        {
            //arrayCutWork = PersonelCodePrint;
            //string[] arrayTemp = PersonelCodePrint.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
            //string personelcode = "";
            //string Year = "";
            //foreach (var item in arrayTemp)
            //{
            //    personelcode = personelcode + item.Split('^')[0].Trim() + ",";
            //    Year = item.Split('^')[5].Trim();
            //}

            //string[] arrayPersonelCode = personelcode.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
            //======================================================================================
            StiReport oRep = new StiReport();
            oRep.Load(Server.MapPath("~/Reports/PersonelCutWork.mrt"));
            var contractkind = office.ofcPersonelContracts.Where(c => c.numPersonelRef == Convert.ToInt32(PersonelCodePrint)).OrderByDescending(c => c.numContractCode).FirstOrDefault();
            if (contractkind.numContractKindRef == 1 || contractkind.numContractKindRef == 3)
            {
                var linq = (from t in office.ofcPersonels
                            join t1 in office.ofcPersonelPreInvoices on t.numPersonelCode equals t1.numPersonelRef
                            join t2 in office.ofcPersonelContracts on t1.numContractRef equals t2.numContractCode
                            where
                                 t.numPersonelCode == Convert.ToInt32(PersonelCodePrint)
                                 &&
                                 t1.numStatus == 3
                            select new
                            {
                                PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                                t.strMelliCode,
                                t.strFatherName,
                                t.strNumberShenasname,
                                t2.dateEndContractDate,
                                PersonelCode = t.numPersonelCode.ToString(),
                                PersonelFather = t.strFatherName.ToString(),
                                dateStartContract = t2.dateStartContractDate,
                                dateCutContract = t2.dateCutWorkDate,
                                MandeMorakhasi = EdariFunc.GetMandeMorakhasi((int)t.numPersonelCode, t2.dateStartContractDate, t2.dateCutWorkDate, (int)t2.numContractKindRef, t1.strInvoiceYear, t1.strInvoiceMonth, (int)t1.numPriceReBuyLeave),
                                HoghoghSabet = t2.numContractKindRef == 2 ? "0" : t2.numPersonelSalary.ToString(),
                                DastmozdRozaneh = EdariFunc.GetDastmozdha((int)t2.numPersonelSalary, (int)t2.numContractKindRef, 1),
                                DastmozdSaati = EdariFunc.GetDastmozdha((int)t2.numPersonelSalary, (int)t2.numContractKindRef, 9),
                                PadashAmalkard = t2.numPersonelPadash.ToString(),
                                PadashSaier = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 1, Convert.ToInt32(t1.strInvoiceMonth), Convert.ToInt32(t1.strInvoiceYear), 0).ToString(),

                                Ezafekar = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobRef, (int)t1.numContractRef, 1, 1),
                                JomeKar = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobRef, (int)t1.numContractRef, 2, 1),
                                Tatilkar = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobRef, (int)t1.numContractRef, 3, 1),
                                Mamoriat = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobRef, (int)t1.numContractRef, 4, 1),
                                Takhir = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobRef, (int)t1.numContractRef, 5, 1),
                                Tajil = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobRef, (int)t1.numContractRef, 6, 1),
                                Ghibat = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobRef, (int)t1.numContractRef, 7, 1),
                                ExitWork = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobRef, (int)t1.numContractRef, 8, 1),
                                MorakhasiBiHoghogh = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobRef, (int)t1.numContractRef, 9, 1),
                                MorakhasiUni = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobRef, (int)t1.numContractRef, 10, 1),
                                EzafekarVijeh = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobRef, (int)t1.numContractRef, 11, 1),
                                EzafekarInMission = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobRef, (int)t1.numContractRef, 12, 1),

                                strContractKindRef = t2.numContractKindRef.ToString(),
                                CheckAmvalPeronel = EdariFunc.PriceAmvalPersonel((int)t.numPersonelCode, 4),
                                PriceAmvalPersonel = EdariFunc.PriceAmvalPersonel((int)t.numPersonelCode, 3),
                                amvalinfo = EdariFunc.GetAllAmvalInfo((int)t.numPersonelCode, 1),
                                imagelogo = t1.numWorkGroupCode == 1 || t1.numWorkGroupCode == 3 ? "http://edari.abnama24.ir/images/logofoctor.png" : t1.numWorkGroupCode == 2 ? "http://edari.abnama24.ir/images/shixonlogo.png" : t1.numWorkGroupCode == 4 ? "http://edari.abnama24.ir/images/memarketlogo.png" : "http://edari.abnama24.ir/images/logofoctor.png",

                            });
                var linq2 = (from t in office.ofcPersonels
                             join t1 in office.ofcPersonelPreInvoices on t.numPersonelCode equals t1.numPersonelRef
                             join t2 in office.ofcPersonelContracts on t1.numContractRef equals t2.numContractCode
                             where
                                 t.numPersonelCode == Convert.ToInt32(PersonelCodePrint)
                                 &&
                                 t1.numStatus == 3
                             select new
                             {
                                 Baghimandehoghogh = t1.numPersonelSalary.ToString(),
                                 PadashAmalkard = t1.numPersonelPadash.ToString(),
                                 HaghMaskan = t1.numPersonelHomeSalary.ToString(),
                                 Bon = t1.numPersonelBon.ToString(),
                                 PadashSaier = t1.numPersonelPadashSaier.ToString(),
                                 EzafeKar = t1.numPriceEzafeKar.ToString(),
                                 EzafeKarVijeh = t1.numPriceEzafeKarVijeh.ToString(),
                                 EzafeKarInMission = t1.numPriceEzafeKarInMission.ToString(),
                                 JomehKar = t1.numPriceJomeKar.ToString(),
                                 TatilKar = t1.numPriceTatilKar.ToString(),
                                 Mamoriat = t1.numPriceMamoriat.ToString(),
                                 BazkharidMorakhasi = t1.numPriceReBuyLeave.ToString(),

                                 Eidi = t1.numPriceEidi.ToString(),
                                 Sanavat = t1.numPersonelSanavat.ToString(),

                                 Saier = t1.numPriceSaier.ToString(),
                                 DescSaier = t1.strDescSaier,
                                 Maliat = t1.numPricePersonelMaliat.ToString(),
                                 Bimeh = t1.numPricePersonelBimeh.ToString(),
                                 BimehTakmili = t1.numPriceBimeTakmili.ToString(),
                                 Takhir = t1.numPriceTakhir.ToString(),
                                 Tajil = t1.numPriceTajil.ToString(),
                                 Ghibat = t1.numPriceGhibat.ToString(),
                                 JarimehMotefareghe = t1.numPriceJarimeMotefareghe.ToString(),
                                 Mosaede = t1.numPriceMosaede.ToString(),
                                 Vam = t1.numPriceVamMontly.ToString(),
                                 KhorojGhireMojaz = t1.numPriceKhorojGhireMojaz.ToString(),
                                 PriceMorakhasiBiHoghogh = t1.numPriceMorakhasiBiHoghogh.ToString(),
                                 PriceMorakhasiUni = t1.numPriceMorakhasiUni.ToString(),

                                 SumPardakht = t1.numPriceCalcHoghogh2.ToString(),
                                 SumKosor = t1.numPriceCalcKosorat.ToString(),
                                 mandeHoghoghAzMaheGhabl = EdariFunc.GetPriceMandeHoghoghInSplit(t1.strMandeAzMaheGhablTafkiki).ToString(),
                                 PriceMoavaghe = t1.numPriceMoavaghe.ToString(),
                                 amvalDarEkhtiarPrice = EdariFunc.PriceAmvalPersonel((int)t.numPersonelCode, 1),
                                 amvalVagozariPrice = EdariFunc.PriceAmvalPersonel((int)t.numPersonelCode, 2),

                                 GetDescPadashAndJarimeh = EdariFunc.GetDescCutWork((int)t.numPersonelCode, (int)t2.numContractKindRef, Convert.ToInt32(t1.strInvoiceYear), Convert.ToInt32(t1.strInvoiceMonth), t1.strMandeAzMaheGhablTafkiki),

                                 kharid = t1.numPriceBuyCo.ToString(),

                                 AyabZahab = t1.numPriceAyabzahab.ToString(),
                                 haghmodiriat = t1.numPriceHaghModiriat.ToString(),

                                 hazinejari = t1.numPriceGhoboz.ToString(),
                                 porsanttozi = t1.numPricePorsantTozi.ToString(),
                                 porsantkharejmahdode = t1.numPricePorsantKharjMahdode.ToString(),
                                 porsantmoadeli = t1.numPricePrintMoadeli.ToString(),

                                 kosormotefareghe = t1.numPriceKosorMotefareghe.ToString(),

                                 mah31roz = t1.numPriceMonth31.ToString(),
                                 mah29roz = t1.numPriceMonth29.ToString(),

                                 jarimehtakhir = t1.numPriceJarimehTakhir8Saat.ToString(),

                                 hagholad = t1.numPersonelChildSalary.ToString(),
                                 khalespardakhti = t1.numPriceCalcHoghoghKhales.ToString(),
                                 imagelogo = t1.numWorkGroupCode == 1 || t1.numWorkGroupCode == 3 ? "http://edari.abnama24.ir/images/logofoctor.png" : t1.numWorkGroupCode == 2 ? "http://edari.abnama24.ir/images/shixonlogo.png" : t1.numWorkGroupCode == 4 ? "http://edari.abnama24.ir/images/memarketlogo.png" : "http://edari.abnama24.ir/images/logofoctor.png",

                             });

                oRep.RegData("PersonelInfo", linq);
                oRep.RegData("PersonelTasvieh", linq2);
                oRep.Dictionary.Synchronize();
                oRep.Render(false);

                MemoryStream stream = new MemoryStream();
                StiHtmlExportSettings settings = new StiHtmlExportSettings();
                settings.AddPageBreaks = true;
                StiHtmlExportService service = new StiHtmlExportService();
                service.ExportHtml(oRep, stream, settings);
                StiHtmlImageHost imghoset = new StiHtmlImageHost(service);
                StiReportResponse.ResponseAsHtml(this, oRep, false, settings, imghoset);
            }
            else if (contractkind.numContractKindRef == 2)
            {
                var linq = (from t in office.ofcPersonels
                            join t1 in office.ofcPersonelPreInvoiceSaatis on t.numPersonelCode equals t1.numPersonelRef
                            join t2 in office.ofcPersonelContracts on t1.numContractRef equals t2.numContractCode
                            where
                                 t.numPersonelCode == Convert.ToInt32(PersonelCodePrint)
                                 &&
                                 t1.numStatus == 3
                            select new
                            {
                                PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                                t.strMelliCode,
                                t.strFatherName,
                                t.strNumberShenasname,
                                t2.dateEndContractDate,
                                PersonelCode = t.numPersonelCode.ToString(),
                                PersonelFather = t.strFatherName.ToString(),
                                dateStartContract = t2.dateStartContractDate,
                                dateCutContract = t2.dateCutWorkDate,
                                MandeMorakhasi = EdariFunc.GetMandeMorakhasi((int)t.numPersonelCode, t2.dateStartContractDate, t2.dateCutWorkDate, (int)t2.numContractKindRef, t1.strInvoiceYear, t1.strInvoiceMonth, (int)t1.numPriceReBuyLeave),
                                HoghoghSabet = t2.numContractKindRef == 2 ? "0" : t2.numPersonelSalary.ToString(),
                                DastmozdRozaneh = EdariFunc.GetDastmozdha((int)t2.numPersonelSalary, (int)t2.numContractKindRef, 1),
                                DastmozdSaati = EdariFunc.GetDastmozdha((int)t2.numPersonelSalary, (int)t2.numContractKindRef, 9),
                                PadashAmalkard = t2.numPersonelPadash.ToString(),
                                PadashSaier = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 1, Convert.ToInt32(t1.strInvoiceMonth), Convert.ToInt32(t1.strInvoiceYear), 0).ToString(),

                                Ezafekar = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobSaatiRef, (int)t1.numContractRef, 1, 1),
                                JomeKar = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobSaatiRef, (int)t1.numContractRef, 2, 1),
                                Tatilkar = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobSaatiRef, (int)t1.numContractRef, 3, 1),
                                Mamoriat = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobSaatiRef, (int)t1.numContractRef, 4, 1),
                                Takhir = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobSaatiRef, (int)t1.numContractRef, 5, 1),
                                Tajil = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobSaatiRef, (int)t1.numContractRef, 6, 1),
                                Ghibat = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobSaatiRef, (int)t1.numContractRef, 7, 1),
                                ExitWork = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobSaatiRef, (int)t1.numContractRef, 8, 1),
                                MorakhasiBiHoghogh = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobSaatiRef, (int)t1.numContractRef, 9, 1),
                                MorakhasiUni = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobSaatiRef, (int)t1.numContractRef, 10, 1),
                                EzafekarVijeh = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobSaatiRef, (int)t1.numContractRef, 11, 1),
                                EzafekarInMission = EdariFunc.GetTimeKarkard((int)t.numPersonelCode, t1.strInvoiceMonth, t1.strInvoiceYear, (int)t1.numMonthlyJobSaatiRef, (int)t1.numContractRef, 12, 1),

                                strContractKindRef = t2.numContractKindRef.ToString(),
                                CheckAmvalPeronel = EdariFunc.PriceAmvalPersonel((int)t.numPersonelCode, 4),
                                PriceAmvalPersonel = EdariFunc.PriceAmvalPersonel((int)t.numPersonelCode, 3),
                                amvalinfo = EdariFunc.GetAllAmvalInfo((int)t.numPersonelCode, 1),

                                imagelogo = t1.numWorkGroupCode == 1 || t1.numWorkGroupCode == 3 ? "http://edari.abnama24.ir/images/logofoctor.png" : t1.numWorkGroupCode == 2 ? "http://edari.abnama24.ir/images/shixonlogo.png" : t1.numWorkGroupCode == 4 ? "http://edari.abnama24.ir/images/memarketlogo.png" : "http://edari.abnama24.ir/images/logofoctor.png",
                            });
                var linq2 = (from t in office.ofcPersonels
                             join t1 in office.ofcPersonelPreInvoiceSaatis on t.numPersonelCode equals t1.numPersonelRef
                             join t2 in office.ofcPersonelContracts on t1.numContractRef equals t2.numContractCode
                             where
                                 t.numPersonelCode == Convert.ToInt32(PersonelCodePrint)
                                 &&
                                 t1.numStatus == 3
                             select new
                             {
                                 Baghimandehoghogh = t1.numPersonelSalary.ToString(),
                                 PadashAmalkard = "0",
                                 HaghMaskan = "0",
                                 Bon = "0",
                                 PadashSaier = t1.numPersonelPadashSaier.ToString(),
                                 EzafeKar = "0",
                                 EzafeKarVijeh = "0",
                                 EzafeKarInMission = "0",
                                 JomehKar = "0",
                                 TatilKar = "0",
                                 Mamoriat = "0",
                                 BazkharidMorakhasi = t1.numPriceReBuyLeave.ToString(),

                                 Eidi = t1.numPriceEidi.ToString(),
                                 Sanavat = "0",

                                 Saier = t1.numPriceSaier.ToString(),
                                 DescSaier = t1.strDescSaier,
                                 Maliat = t1.numPricePersonelMaliat.ToString(),
                                 Bimeh = t1.numPricePersonelBimeh.ToString(),
                                 BimehTakmili = t1.numPriceBimeTakmili.ToString(),
                                 Takhir = "0",
                                 Tajil = "0",
                                 Ghibat = "0",
                                 JarimehMotefareghe = t1.numPriceJarimeMotefareghe.ToString(),
                                 Mosaede = t1.numPriceMosaede.ToString(),
                                 Vam = t1.numPriceVamMontly.ToString(),
                                 KhorojGhireMojaz = "0",
                                 PriceMorakhasiBiHoghogh = "0",
                                 PriceMorakhasiUni = "0",

                                 SumPardakht = t1.numPriceCalcHoghogh1.ToString(),
                                 SumKosor = t1.numPriceCalcKosorat.ToString(),
                                 mandeHoghoghAzMaheGhabl = EdariFunc.GetPriceMandeHoghoghInSplit(t1.strMandeAzMaheGhablTafkiki).ToString(),
                                 PriceMoavaghe = t1.numPriceMoavaghe.ToString(),
                                 amvalDarEkhtiarPrice = EdariFunc.PriceAmvalPersonel((int)t.numPersonelCode, 1),
                                 amvalVagozariPrice = EdariFunc.PriceAmvalPersonel((int)t.numPersonelCode, 2),

                                 GetDescPadashAndJarimeh = EdariFunc.GetDescCutWork((int)t.numPersonelCode, (int)t2.numContractKindRef, Convert.ToInt32(t1.strInvoiceYear), Convert.ToInt32(t1.strInvoiceMonth), t1.strMandeAzMaheGhablTafkiki),

                                 kharid = t1.numPriceBuyCo.ToString(),

                                 AyabZahab = t1.numPriceAyabzahab.ToString(),
                                 haghmodiriat = "0",

                                 hazinejari = "0",
                                 porsanttozi = "0",
                                 porsantkharejmahdode = "0",
                                 porsantmoadeli = "0",

                                 kosormotefareghe = t1.numPriceKosorMotefareghe.ToString(),

                                 mah31roz = "0",
                                 mah29roz = "0",

                                 jarimehtakhir = "0",

                                 hagholad = "0",
                                 khalespardakhti = t1.numPriceCalcHoghoghKhales.ToString(),
                                imagelogo = t1.numWorkGroupCode == 1 || t1.numWorkGroupCode == 3 ? "http://edari.abnama24.ir/images/logofoctor.png" : t1.numWorkGroupCode == 2 ? "http://edari.abnama24.ir/images/shixonlogo.png" : t1.numWorkGroupCode == 4 ? "http://edari.abnama24.ir/images/memarketlogo.png" : "http://edari.abnama24.ir/images/logofoctor.png",
                             });

                oRep.RegData("PersonelInfo", linq);
                oRep.RegData("PersonelTasvieh", linq2);
                oRep.Dictionary.Synchronize();
                oRep.Render(false);

                MemoryStream stream = new MemoryStream();
                StiHtmlExportSettings settings = new StiHtmlExportSettings();
                settings.AddPageBreaks = true;
                StiHtmlExportService service = new StiHtmlExportService();
                service.ExportHtml(oRep, stream, settings);
                StiHtmlImageHost imghoset = new StiHtmlImageHost(service);
                StiReportResponse.ResponseAsHtml(this, oRep, false, settings, imghoset);
            }
        }
    }
    //---------------------------------------------------------------------------
    //-------------------------------------پرینت فیش حقوقی--------------------------------------
    //---------------------------------------------------------------------------
    private void GetInfoFishHoghogh()
    {
        string invoiceCode = Request.QueryString["ofcFish"];
        if (invoiceCode != null)
        {
            string itemserach = Request.QueryString["itemsearch"];
            string month = itemserach.Split(',')[0];
            string year = itemserach.Split(',')[1];
            string contractKind = itemserach.Split(',')[2];
            string[] arrayinvoiceCode = invoiceCode.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
            //======================================================================================
            StiReport oRep = new StiReport();
            if (contractKind == "1" || contractKind == "3") // movaghat and projeie
            {
                var linq = (from t in office.ofcPersonelPreInvoices
                            join t2 in office.ofcPersonelContracts on t.numContractRef equals t2.numContractCode
                            join t3 in office.ofcPersonels on t.numPersonelRef equals t3.numPersonelCode
                            join t5 in office.ofcBWorkGroups on t.numWorkGroupCode equals t5.numWorkGroupCode
                            join t6 in office.ofcBWorkGroupBakhshes on t2.numBakhshWorkGroupRef equals t6.numBakhshWorkGroupCode into join_t6
                            from t6 in join_t6.DefaultIfEmpty()
                            join t7 in office.ofcBWorkGroupGhesmats on t2.numGhesmatWorkgroupRef equals t7.numGhesmatWorkgroupCode into join_t7
                            from t7 in join_t7.DefaultIfEmpty()
                            where
                                 arrayinvoiceCode.Contains(t.numInvoiceCode.ToString())
                                 &&
                                 (t.numStatus == 1 || t.numStatus == 2)
                                 &&
                                 t.numContractKindRef == Convert.ToInt16(contractKind)
                            select new
                            {
                                PersonelCode = t.numPersonelRef.ToString(),
                                name = t3.strPersonelName,
                                family = t3.strPersonelFamily,
                                shsh = t3.strNumberShenasname,
                                codeMeli = t3.strMelliCode,
                                vahedeKhedmat = t5.strWorkGroupName,
                                semat = (t6.strBakhshName == null || t6.strBakhshName == "" ? "-" : t6.strBakhshName) + "/" + (t7.strGhesmatName == null || t7.strGhesmatName == "" ? "-" : t7.strGhesmatName),
                                shomarehesab = t.strBankAccount,
                                shomarebimeh = EdariFunc.GetnumberBimeh((int)t.numPersonelRef),

                                morakhasiEstilajiSaati = EdariFunc.GetMorakhasiFish((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, t2.dateStartContractDate, t2.dateCutWorkDate, 1),
                                morakhasiEstilajiRozane = EdariFunc.GetMorakhasiFish((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, t2.dateStartContractDate, t2.dateCutWorkDate, 2),
                                morakhasiEzdevajFot = EdariFunc.GetMorakhasiFish((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, t2.dateStartContractDate, t2.dateCutWorkDate, 3),
                                morakhasiEstehghaighiSaati = EdariFunc.GetMorakhasiFish((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, t2.dateStartContractDate, t2.dateCutWorkDate, 4),
                                mandeMorakhasiEstehghaghiRozaneh = EdariFunc.GetMorakhasiFish((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, t2.dateStartContractDate, t2.dateCutWorkDate, 5),
                                morakhasiBiHoghoghSaati = EdariFunc.GetMorakhasiFish((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, t2.dateStartContractDate, t2.dateCutWorkDate, 6),
                                morakhasiBiHoghoghRozaneh = EdariFunc.GetMorakhasiFish((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, t2.dateStartContractDate, t2.dateCutWorkDate, 7),
                                MorakhasiuniSaati = EdariFunc.GetMorakhasiFish((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, t2.dateStartContractDate, t2.dateCutWorkDate, 8),
                                Morakhasiunirozaneh = EdariFunc.GetMorakhasiFish((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, t2.dateStartContractDate, t2.dateCutWorkDate, 9),
                                MandeMorakhasiSal = EdariFunc.GetMorakhasiFish((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, t2.dateStartContractDate, t2.dateCutWorkDate, 10),

                                MandeVam = EdariFunc.GetMandeVam((int)t.numPersonelRef, Convert.ToInt32(t.strVamRef)),
                                RozKarkard = t.strJobDays,
                                DastmozdRozane = EdariFunc.GetDastmozdha((int)(t.numContractKindRef == 3 ? hoghoghSabet : t2.numPersonelSalary), (int)t.numContractKindRef, 1),
                                EzafeKar = EdariFunc.GetTimeKarkard((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, (int)t.numMonthlyJobRef, (int)t.numContractRef, 1, 0),
                                HaghEzafeKar = EdariFunc.GetDastmozdha((int)(t.numContractKindRef == 3 ? hoghoghSabet : t2.numPersonelSalary), (int)t.numContractKindRef, 2),

                                EzafeKarVijeh = EdariFunc.GetTimeKarkard((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, (int)t.numMonthlyJobRef, (int)t.numContractRef, 11, 0),
                                HaghEzafeKarVijeh = EdariFunc.GetDastmozdha((int)(t.numContractKindRef == 3 ? hoghoghSabet : t2.numPersonelSalary), (int)t.numContractKindRef, 2),

                                EzafeKarInMission = EdariFunc.GetTimeKarkard((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, (int)t.numMonthlyJobRef, (int)t.numContractRef, 12, 0),
                                HaghEzafeKarInMission = EdariFunc.GetDastmozdha((int)(t.numContractKindRef == 3 ? hoghoghSabet : t2.numPersonelSalary), (int)t.numContractKindRef, 2),

                                JomehKar = EdariFunc.GetTimeKarkard((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, (int)t.numMonthlyJobRef, (int)t.numContractRef, 2, 0),
                                HaghJomeKar = EdariFunc.GetDastmozdha((int)(t.numContractKindRef == 3 ? hoghoghSabet : t2.numPersonelSalary), (int)t.numContractKindRef, 3),
                                TatilKar = EdariFunc.GetTimeKarkard((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, (int)t.numMonthlyJobRef, (int)t.numContractRef, 3, 0),
                                HaghTatilKar = EdariFunc.GetDastmozdha((int)(t.numContractKindRef == 3 ? hoghoghSabet : t2.numPersonelSalary), (int)t.numContractKindRef, 4),
                                Mamoriat = EdariFunc.GetTimeKarkard((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, (int)t.numMonthlyJobRef, (int)t.numContractRef, 4, 0),
                                HaghMamoriat = EdariFunc.GetDastmozdha((int)(t.numContractKindRef == 3 ? hoghoghSabet : t2.numPersonelSalary), (int)t.numContractKindRef, 5),
                                Takhir = EdariFunc.GetTimeKarkard((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, (int)t.numMonthlyJobRef, (int)t.numContractRef, 5, 0),
                                JarimehTakhir = EdariFunc.GetDastmozdha((int)(t.numContractKindRef == 3 ? hoghoghSabet : t2.numPersonelSalary), (int)t.numContractKindRef, 6),
                                Tajil = EdariFunc.GetTimeKarkard((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, (int)t.numMonthlyJobRef, (int)t.numContractRef, 6, 0),
                                JarimehTajil = EdariFunc.GetDastmozdha((int)(t.numContractKindRef == 3 ? hoghoghSabet : t2.numPersonelSalary), (int)t.numContractKindRef, 7),
                                Ghibat = EdariFunc.GetTimeKarkard((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, (int)t.numMonthlyJobRef, (int)t.numContractRef, 7, 0),
                                JarimehGhibat = EdariFunc.GetDastmozdha((int)(t.numContractKindRef == 3 ? hoghoghSabet : t2.numPersonelSalary), (int)t.numContractKindRef, 8),
                                ExitJob = EdariFunc.GetTimeKarkard((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, (int)t.numMonthlyJobRef, (int)t.numContractRef, 8, 0),
                                JarimehExitJob = EdariFunc.GetDastmozdha((int)(t.numContractKindRef == 3 ? hoghoghSabet : t2.numPersonelSalary), (int)t.numContractKindRef, 10),
                                MorakhasiBiHoghogh = EdariFunc.GetTimeKarkard((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, (int)t.numMonthlyJobRef, (int)t.numContractRef, 9, 0),
                                JarimeMorakhasiBiHoghogh = EdariFunc.GetDastmozdha((int)((t.numContractKindRef == 3 ? hoghoghSabet : (t2.numPersonelSalary + t2.numPersonelHomeSalary + t2.numPersonelBon + t2.numPersonelPadash + t2.numPersonelChildSalary))), (int)t.numContractKindRef, 11),
                                MorakhasiUni = EdariFunc.GetTimeKarkard((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, (int)t.numMonthlyJobRef, (int)t.numContractRef, 10, 0),
                                JarimehMorakhasiUni = EdariFunc.GetDastmozdha((int)((t.numContractKindRef == 3 ? hoghoghSabet : (t2.numPersonelSalary + t2.numPersonelHomeSalary + t2.numPersonelBon + t2.numPersonelPadash + t2.numPersonelChildSalary))), (int)t.numContractKindRef, 12),

                                PriceHoghoghSabet = t.numPersonelSalary.ToString(),
                                PriceHaghMaskan = t.numPersonelHomeSalary.ToString(),
                                PriceBon = t.numPersonelBon.ToString(),
                                PriceEzafeKar = t.numPriceEzafeKar.ToString(),
                                PriceEzafeKarvijeh = t.numPriceEzafeKarVijeh.ToString(),
                                PriceEzafeKarInMission = t.numPriceEzafeKarInMission.ToString(),
                                PriceJomeKar = t.numPriceJomeKar.ToString(),
                                PriceTatilKar = t.numPriceTatilKar.ToString(),

                                PriceHaghOlad = t.numPersonelChildSalary.ToString(),
                                PriceMamoriat = t.numPriceMamoriat.ToString(),
                                PricePadashAmalkard = t.numPersonelPadash.ToString(),
                                PricePadashSaier = t.numPersonelPadashSaier.ToString(),
                                PriceEidi = t.numPriceEidi.ToString(),
                                PriceSanavat = t.numPersonelSanavat.ToString(),
                                Maliat = t.numPricePersonelMaliat.ToString(),
                                BimehKarmand = t.numPricePersonelBimeh.ToString(),
                                BimehTakmili = t.numPriceBimeTakmili.ToString(),
                                GhestVam = t.numPriceVamMontly.ToString(),
                                Mosaede = t.numPriceMosaede.ToString(),
                                PriceTakhir = t.numPriceTakhir.ToString(),
                                PriceTajil = t.numPriceTajil.ToString(),
                                PriceGhibat = t.numPriceGhibat.ToString(),
                                PriceJarimehMotafareghe = t.numPriceJarimeMotefareghe.ToString(),
                                KhorojGhireMojaz = t.numPriceKhorojGhireMojaz.ToString(),
                                PriceMorakhasiBiHoghogh = t.numPriceMorakhasiBiHoghogh.ToString(),
                                //GetPriceMorakhasiBiHoghogh((int)(t.numPersonelSalary + t.numPersonelHomeSalary + t.numPersonelBon + t.numPersonelPadash), (int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear),
                                PriceMorakhasiUni = t.numPriceMorakhasiUni.ToString(),
                                SumPardakht = t.numPriceCalcHoghogh2.ToString(),
                                SumKosor = t.numPriceCalcKosorat.ToString(),
                                KhalesPardakhti = t.numPriceCalcHoghoghKhales.ToString(),
                                Description = EdariFunc.GetDesc((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, (int)t.numMonthlyJobRef, t.strMandeAzMaheGhablTafkiki, (int)t.numContractKindRef, t2.dateStartContractDate, t2.dateCutWorkDate, 1),
                                lblMonth = EdariFunc.GetMonthName(t.strInvoiceMonth),
                                lblYear = t.strInvoiceYear,
                                MandeAzMaheGhabl = EdariFunc.GetPriceMandeHoghoghInSplit(t.strMandeAzMaheGhablTafkiki).ToString(),
                                numPriceMoavaghe = t.numPriceMoavaghe.ToString(),
                                kharid = t.numPriceBuyCo.ToString(),

                                BazkharidMorakhasi = t.numPriceReBuyLeave.ToString(),

                                PriceAyabzahab = t.numPriceAyabzahab.ToString(),
                                PriceHaghModiriat = t.numPriceHaghModiriat.ToString(),


                                hazinejari = t.numPriceGhoboz.ToString(),
                                porsanttozi = t.numPricePorsantTozi.ToString(),
                                porsantkharejmahdode = t.numPricePorsantKharjMahdode.ToString(),
                                porsantmoadeli = t.numPricePrintMoadeli.ToString(),

                                kosormotefareghe = t.numPriceKosorMotefareghe.ToString(),

                                mah31roz = t.numPriceMonth31.ToString(),
                                mah29roz = t.numPriceMonth29.ToString(),

                                takhir8saat = EdariFunc.GetDayTakhir8Houer(EdariFunc.GetTimeKarkard((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, (int)t.numMonthlyJobRef, (int)t.numContractRef, 5, 0)).ToString(),
                                jarimehtakhir8saat = EdariFunc.GetDastmozdha((int)(t.numContractKindRef == 3 ? hoghoghSabet : t2.numPersonelSalary), (int)t.numContractKindRef, 8),
                                priceTakhir8saat = t.numPriceJarimehTakhir8Saat.ToString(),

                                imagelogo = t.numWorkGroupCode == 1 || t.numWorkGroupCode == 3 ? "http://edari.abnama24.ir/images/logofoctor.png" : t.numWorkGroupCode == 2 ? "http://edari.abnama24.ir/images/shixonlogo.png" : t.numWorkGroupCode == 4 ? "http://edari.abnama24.ir/images/memarketlogo.png" : "http://edari.abnama24.ir/images/logofoctor.png",
                            });

                if (linq.Count() > 0)
                {
                    if (contractKind == "1")
                        oRep.Load(Server.MapPath("~/Reports/PersonelFishHoghogh.mrt"));
                    else if (contractKind == "3")
                        oRep.Load(Server.MapPath("~/Reports/PersonelFishHoghoghProject.mrt"));

                    oRep.RegData("FishHoghogh", linq);
                    oRep.Dictionary.Synchronize();
                    oRep.Render(false);

                    StiPdfExportSettings pdfexport = new StiPdfExportSettings();
                    pdfexport.ImageQuality = 1f;
                    pdfexport.ImageResolution = 300;
                    pdfexport.Compressed = true;
                    pdfexport.ImageCompressionMethod = StiPdfImageCompressionMethod.Flate;
                    StiReportResponse.ResponseAsPdf(this, oRep, false, pdfexport);
                }
            }
            else if (contractKind == "2") // saati
            {
                var linq = (from t in office.ofcPersonelPreInvoiceSaatis
                            join t2 in office.ofcPersonelContracts on t.numContractRef equals t2.numContractCode
                            join t3 in office.ofcPersonels on t.numPersonelRef equals t3.numPersonelCode
                            join t5 in office.ofcBWorkGroups on t.numWorkGroupCode equals t5.numWorkGroupCode
                            join t6 in office.ofcBWorkGroupBakhshes on t2.numBakhshWorkGroupRef equals t6.numBakhshWorkGroupCode into join_t6
                            from t6 in join_t6.DefaultIfEmpty()
                            join t7 in office.ofcBWorkGroupGhesmats on t2.numGhesmatWorkgroupRef equals t7.numGhesmatWorkgroupCode into join_t7
                            from t7 in join_t7.DefaultIfEmpty()

                            where
                                 arrayinvoiceCode.Contains(t.numInvoiceSaatiCode.ToString())
                                 &&
                                 (t.numStatus == 1 || t.numStatus == 2)
                                 &&
                                 t.numContractKindRef == Convert.ToInt16(contractKind)

                            select new
                            {
                                PersonelCode = t.numPersonelRef.ToString(),
                                name = t3.strPersonelName,
                                family = t3.strPersonelFamily,
                                shsh = t3.strNumberShenasname,
                                codeMeli = t3.strMelliCode,
                                vahedeKhedmat = t5.strWorkGroupName,
                                semat = (t6.strBakhshName == null || t6.strBakhshName == "" ? "-" : t6.strBakhshName) + "/" + (t7.strGhesmatName == null || t7.strGhesmatName == "" ? "-" : t7.strGhesmatName),
                                shomarehesab = t.strBankAccount,
                                shomarebimeh = EdariFunc.GetnumberBimeh((int)t.numPersonelRef),

                                MandeVam = EdariFunc.GetMandeVam((int)t.numPersonelRef, Convert.ToInt32(t.strVamRef)),
                                RozKarkard = t.strJobTime,
                                DastmozdRozane = t2.numPersonelSalary.ToString(),

                                PriceHoghoghSabet = t.numPersonelSalary.ToString(),
                                PricePadashSaier = t.numPersonelPadashSaier.ToString(),
                                Maliat = t.numPricePersonelMaliat.ToString(),
                                BimehKarmand = t.numPricePersonelBimeh.ToString(),
                                BimehTakmili = t.numPriceBimeTakmili.ToString(),
                                GhestVam = t.numPriceVamMontly.ToString(),
                                Mosaede = t.numPriceMosaede.ToString(),
                                PriceJarimehMotafareghe = t.numPriceJarimeMotefareghe.ToString(),
                                SumPardakht = t.numPriceCalcHoghogh1.ToString(),
                                SumKosor = t.numPriceCalcKosorat.ToString(),
                                KhalesPardakhti = t.numPriceCalcHoghoghKhales.ToString(),
                                Description = EdariFunc.GetDesc((int)t.numPersonelRef, t.strInvoiceMonth, t.strInvoiceYear, (int)t.numMonthlyJobSaatiRef, t.strMandeAzMaheGhablTafkiki, (int)t.numContractKindRef, t2.dateStartContractDate, t2.dateCutWorkDate, 2),
                                lblMonth = EdariFunc.GetMonthName(t.strInvoiceMonth),
                                lblYear = t.strInvoiceYear,
                                MandeAzMaheGhabl = EdariFunc.GetPriceMandeHoghoghInSplit(t.strMandeAzMaheGhablTafkiki).ToString(),
                                numPriceMoavaghe = t.numPriceMoavaghe.ToString(),
                                kharid = t.numPriceBuyCo.ToString(),
                                AyabZahab = t.numPriceAyabzahab.ToString(),
                                kosormotefareghe = t.numPriceKosorMotefareghe.ToString(),
                                imagelogo = t.numWorkGroupCode == 1 || t.numWorkGroupCode == 3 ? "http://edari.abnama24.ir/images/logofoctor.png" : t.numWorkGroupCode == 2 ? "http://edari.abnama24.ir/images/shixonlogo.png" : t.numWorkGroupCode == 4 ? "http://edari.abnama24.ir/images/memarketlogo.png" : "http://edari.abnama24.ir/images/logofoctor.png",
                            });

                if (linq.Count() > 0)
                {
                    if (contractKind == "2")
                        oRep.Load(Server.MapPath("~/Reports/PersonelFishHoghoghSaati.mrt"));

                    oRep.RegData("FishHoghogh", linq);
                    oRep.Dictionary.Synchronize();
                    oRep.Render(false);

                    StiPdfExportSettings pdfexport = new StiPdfExportSettings();
                    pdfexport.ImageQuality = 1f;
                    pdfexport.ImageResolution = 300;
                    pdfexport.Compressed = true;
                    pdfexport.ImageCompressionMethod = StiPdfImageCompressionMethod.Flate;
                    StiReportResponse.ResponseAsPdf(this, oRep, false, pdfexport);
                }
            }
        }
    }
    //---------------------------------------------------------------------------
    //-------------------------------------پرینت فرآیند پرسنل-------------------
    //---------------------------------------------------------------------------
    private void GetInfoPersonelFaraiand()
    {
        string faraiandCode = Request.QueryString["ofcFaraiand"];
        if (faraiandCode != null)
        {
            string itemserach = Request.QueryString["itemsearch"];
            string month = itemserach.Split(',')[0];
            string year = itemserach.Split(',')[1];
            string[] arrayfaraiandCode = faraiandCode.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
            //======================================================================================
            StiReport oRep = new StiReport();

            var linq = (from t in office.ofcPersonelFaraiandCalcs
                        join t2 in office.ofcPersonelContracts on t.numContractRef equals t2.numContractCode
                        join t3 in office.ofcPersonels on t.numPersonelRef equals t3.numPersonelCode
                        join t5 in office.ofcBWorkGroups on t.numWorkGroupRef equals t5.numWorkGroupCode
                        where
                             arrayfaraiandCode.Contains(t.numFaraiandCalcCode.ToString())
                             &&
                             (t.numStatus == 0)
                             &&
                             t2.numContractKindRef == 3
                        select new
                        {
                            PersonelCode = t.numPersonelRef.ToString(),
                            name = t3.strPersonelName + " " + t3.strPersonelFamily,
                            family = t3.strPersonelFamily,
                            shomarehesab = t.strBankAccount,
                            CountFaraiand = t.numCountFaraiandProject.ToString(),
                            PriceOneFaraind = t.numPriceOneFaraind.ToString(),
                            PriceCalcFaraindKhales = t.numPriceCalcFaraindKhales.ToString(),
                            BankName = t.strBankName,
                            lblMonth = EdariFunc.GetMonthName(t.numMonthJob.ToString()),
                            lblYear = t.numYear.ToString(),
                            WorkGroup = t5.strWorkGroupName,

                        });
            if (linq.Count() > 0)
            {
                string workgroupTemp = "";
                var q = linq.Select(c => c.WorkGroup).Distinct();
                int cntall = office.ofcBWorkGroups.Select(c => c.numWorkGroupCode).Count();
                if (q.Count() == cntall)
                {
                    workgroupTemp = "همه گروه ها";
                }
                else
                {
                    foreach (var item in q)
                    {
                        if (workgroupTemp == "")
                            workgroupTemp = item;
                        else
                            workgroupTemp = workgroupTemp + "," + item;
                    }
                }
                oRep.Load(Server.MapPath("~/Reports/PersonelFaraiandHoghogh.mrt"));

                oRep.Dictionary.Variables["lblWorkGroup"].Value = workgroupTemp.Trim();
                oRep.RegData("PrintFaraiand", linq);
                oRep.Dictionary.Synchronize();
                oRep.Render(false);

                StiPdfExportSettings pdfexport = new StiPdfExportSettings();
                pdfexport.ImageQuality = 1f;
                pdfexport.ImageResolution = 300;
                pdfexport.Compressed = true;
                pdfexport.ImageCompressionMethod = StiPdfImageCompressionMethod.Flate;
                StiReportResponse.ResponseAsPdf(this, oRep, false, pdfexport);
            }
        }

    }
    //---------------------------------------------------------------------------
    //-------------------------------------پرینت عیدی پرسنل-------------------
    //---------------------------------------------------------------------------
    private void GetInfoPersonelEidi()
    {
        string EidiCode = Request.QueryString["ofcEidi"];
        if (EidiCode != null)
        {
            string itemserach = Request.QueryString["itemsearch"];
            string year = itemserach.Split('^')[0];
            string[] arrayEidiCode = EidiCode.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
            //======================================================================================
            StiReport oRep = new StiReport();

            var linq = (from t in office.ofcPersonelEidiEndYears
                        join t3 in office.ofcPersonels on t.numPersonelRef equals t3.numPersonelCode
                        join t5 in office.ofcBWorkGroups on t.numWorkGroupCode equals t5.numWorkGroupCode
                        join t2 in office.ofcBContractKinds on t.numContractKindRef equals t2.numContractKindCode
                        where
                             arrayEidiCode.Contains(t.numEidiEndYearCode.ToString())
                             &&
                             (t.numStatus == 0)
                             &&
                             t.numYear == Convert.ToInt16(year)
                        select new
                        {
                                imagelogo = t.numWorkGroupCode == 1 || t.numWorkGroupCode == 3 ? "http://edari.abnama24.ir/images/logofoctor.png" : t.numWorkGroupCode == 2 ? "http://edari.abnama24.ir/images/shixonlogo.png" : t.numWorkGroupCode == 4 ? "http://edari.abnama24.ir/images/memarketlogo.png" : "http://edari.abnama24.ir/images/logofoctor.png",
                            t.strBankName,
                            t.strBankAccount,
                            PersonelCode = t.numPersonelRef.ToString(),
                            Name = t3.strPersonelName + " " + t3.strPersonelFamily,
                            Rozkarkard = t.numDayInYear.ToString(),
                            HoghoghSabet = t.numPriceRoot.ToString(),
                            EidiYekRoz = t.numPriceEidiOneDay.ToString(),
                            Year = t.numYear.ToString(),
                            ContractKind = t2.strContractKindName.ToString(),
                            SumPrice = t.numPriceSettleEidiEndYear.ToString(),
                            WorkGroup = t5.strWorkGroupName.ToString(),
                            level = (t.numIsLevelVariz == 1 ? "مرحله اول واریز" : t.numIsLevelVariz == 2 ? "مرحله دوم واریز" : t.numIsLevelVariz == 3 ? "مرحله سوم واریز" : t.numIsLevelVariz == 4 ? "مرحله چهارم واریز" : "تعریف نشده"),
                            levelnumber = (t.numCountLevel == 1 ? "کامل" : t.numCountLevel == 2 ? "دو مرحله ای" : t.numCountLevel == 3 ? "سه مرحله ای" : t.numCountLevel == 4 ? "چهار مرحله ای" : "تعریف نشده"),
                        }).OrderBy(c => c.PersonelCode);
            if (linq.Count() > 0)
            {

                string workgroupTemp = "";
                var q = linq.Select(c => c.WorkGroup).Distinct();
                int cntall = office.ofcBWorkGroups.Select(c => c.numWorkGroupCode).Count();
                if (q.Count() == cntall)
                {
                    workgroupTemp = "همه گروه ها";
                }
                else
                {
                    foreach (var item in q)
                    {
                        if (workgroupTemp == "")
                            workgroupTemp = item;
                        else
                            workgroupTemp = workgroupTemp + "," + item;
                    }
                }
                oRep.Load(Server.MapPath("~/Reports/PersonelEidiEndYear.mrt"));

                oRep.Dictionary.Variables["lblWorkGroup"].Value = workgroupTemp.Trim();
                oRep.RegData("PrintEidi", linq);
                oRep.Dictionary.Synchronize();
                oRep.Render(false);

                StiPdfExportSettings pdfexport = new StiPdfExportSettings();
                pdfexport.ImageQuality = 1f;
                pdfexport.ImageResolution = 300;
                pdfexport.Compressed = true;
                pdfexport.ImageCompressionMethod = StiPdfImageCompressionMethod.Flate;
                StiReportResponse.ResponseAsPdf(this, oRep, false, pdfexport);
            }


        }

    }
    //---------------------------------------------------------------------------
    //-------------------------------------پرینت بازخرید مرخصی پرسنل-------------------
    //---------------------------------------------------------------------------
    private void GetInfoPersonelMorakhasi()
    {
        string MorakhasiCode = Request.QueryString["ofcMorakhasi"];
        if (MorakhasiCode != null)
        {
            string itemserach = Request.QueryString["itemsearch"];
            string year = itemserach.Split('^')[0];
            string[] arrayMorakhasiCode = MorakhasiCode.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
            //======================================================================================
            StiReport oRep = new StiReport();

            var linq = (from t in office.ofcPersonelLeaveEndYears
                        join t3 in office.ofcPersonels on t.numPersonelRef equals t3.numPersonelCode
                        join t5 in office.ofcBWorkGroups on t.numWorkGroupCode equals t5.numWorkGroupCode
                        join t2 in office.ofcBContractKinds on t.numContractKindRef equals t2.numContractKindCode
                        where
                             arrayMorakhasiCode.Contains(t.numLeaveEndYearCode.ToString())
                             &&
                             (t.numStatus == 0)
                             &&
                             t.numYear == Convert.ToInt16(year)
                        select new
                        {
                                imagelogo = t.numWorkGroupCode == 1 || t.numWorkGroupCode == 3 ? "http://edari.abnama24.ir/images/logofoctor.png" : t.numWorkGroupCode == 2 ? "http://edari.abnama24.ir/images/shixonlogo.png" : t.numWorkGroupCode == 4 ? "http://edari.abnama24.ir/images/memarketlogo.png" : "http://edari.abnama24.ir/images/logofoctor.png",
                            t.strBankName,
                            t.strBankAccount,
                            PersonelCode = t.numPersonelRef.ToString(),
                            Name = t3.strPersonelName + " " + t3.strPersonelFamily,
                            HoghoghSabet = t.numPriceRoot.ToString(),
                            Year = t.numYear.ToString(),
                            ContractKind = t2.strContractKindName.ToString(),
                            WorkGroup = t5.strWorkGroupName.ToString(),
                            LeaveInYear = t.strCountLeaveInYear,
                            LeaveOut = t.strCountLeaveOut,
                            LeaveRemained = t.strCountLeaveRemained,
                            PayableLeave = t.strCountPayableLeave,
                            PayOffLeave = t.strCountPayOffLeave,
                            SumPrice = t.numPriceSettleLeaveEndYear.ToString()
                        }).OrderBy(c => c.PersonelCode);
            if (linq.Count() > 0)
            {

                string workgroupTemp = "";
                var q = linq.Select(c => c.WorkGroup).Distinct();
                int cntall = office.ofcBWorkGroups.Select(c => c.numWorkGroupCode).Count();
                if (q.Count() == cntall)
                {
                    workgroupTemp = "همه گروه ها";
                }
                else
                {
                    foreach (var item in q)
                    {
                        if (workgroupTemp == "")
                            workgroupTemp = item;
                        else
                            workgroupTemp = workgroupTemp + "," + item;
                    }
                }
                oRep.Load(Server.MapPath("~/Reports/PersonelMorakhasiEndYear.mrt"));

                oRep.Dictionary.Variables["lblWorkGroup"].Value = workgroupTemp.Trim();
                oRep.RegData("PrintMorakhasi", linq);
                oRep.Dictionary.Synchronize();
                oRep.Render(false);

                StiPdfExportSettings pdfexport = new StiPdfExportSettings();
                pdfexport.ImageQuality = 1f;
                pdfexport.ImageResolution = 300;
                pdfexport.Compressed = true;
                pdfexport.ImageCompressionMethod = StiPdfImageCompressionMethod.Flate;
                StiReportResponse.ResponseAsPdf(this, oRep, false, pdfexport);
            }


        }

    }

}
