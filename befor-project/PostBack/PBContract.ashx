<%@ WebHandler Language="C#" Class="PBContract" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.SessionState;
using System.IO;

public class PBContract : IHttpHandler, IReadOnlySessionState
{
    ofcUser _ofcUser;
    Function func = new Function();
    h8.h8 _h8 = new h8.h8();
    HttpContext context = HttpContext.Current;
    OfficeDataContext office;
    JavaScriptSerializer serializer = new JavaScriptSerializer();
    PersianDateTime _PDate = new PersianDateTime(0);
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    public void ProcessRequest(HttpContext context)
    {
        string Url = context.Request.Url.Host.Trim().ToLower();
        string HTTP_REFERER = context.Request.ServerVariables["HTTP_REFERER"];
        if (HTTP_REFERER != null && HTTP_REFERER.IndexOf(Url) != -1)
        {
            if (context.Session["Office"] == null) context.Response.Redirect("login.aspx"); else _ofcUser = (ofcUser)context.Session["Office"];

            office = new OfficeDataContext(func.Officecstr.Trim());
            int input = Convert.ToInt32(context.Request.Form["i"]);
            switch (input)
            {
                case 1:
                    GetAlldrpdwnRegisterPersonel();//دریافت کل دراپ دان ها
                    break;
                case 2:
                    RegisterPersonelMovaghat();//ثبت کارمند قرارداد موقت
                    break;
                case 3:
                    GetReportPersonel();//دریافت اطلاعات پرسنلی 
                    break;
                case 4:
                    GetReportPersonelContract();//دریافت اطلاعات پرسنلی برای بارگزاری مدرک
                    break;
                case 5:
                    UploadFileContract();//آپلود اسکن قرارداد
                    break;
                case 6:
                    RegisterPersonelProjectAndSaati();//ثبت کارمند قرارداد ساعتی و پیمانکاری
                    break;
                case 7:
                    DeletePersonel();//حذف اطلاعات کارمند 
                    break;
                case 8:
                    EditPersonel();//ویرایش اطلاعات کارمند 
                    break;
                case 9:
                    saveContractFinal();//ثبت نهایی قرارداد
                    break;
                case 10:
                    GetInfoPersonelForReContract();//دریافت اطلاعات پرسنل برای همکاری مجدد
                    break;
                case 11:
                    GetInfoPersonelEndContract();// دریافت اطلاعات پرسنلی که تاریخ پایان قرارداداشان سر رسیده
                    break;
                case 12:
                    GetCountPersonelEndContract();// دریافت تعداد پرسنلی که تاریخ پایان قرارداداشان سر رسیده
                    break;
                case 13:
                    ReContractFromOldContract();// کپی از قرارداد فعلی
                    break;
                case 14:
                    GetCountPersonelWorkGroupNon();// تعداد پرسنلی که گروه کاری ندارند
                    break;
                case 15:
                    CutContractPersonel();// قطع همکاری پرسنل 
                    break;
                case 16:
                    ChangePersoenlStatusTomoalagh();// معلق کردن پرسنل
                    break;
                case 17:
                    GetCountNewPeik();// تعداد موزعین جدید ثبت شده در سیستم
                    break;
                case 18:
                    GetReportNewPeik();// گزارش موزعین جدید ثبت شده در سیستم
                    break;
                case 19:
                    CompleteInfoPeikPersonel();// تکمیل اطلاعات موزع
                    break;
                case 20:
                    GetBetweenDateMonthAndDay();// محاسبه ماه و روز
                    break;
            }

        }
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
                           item = t.strProvinceName,
                           value2 = t.strPostCenterCode

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

        var contractstate = from t in office.ofcBContractStates
                            where t.numStatus == 1
                            select new
                            {
                                value = t.numContractStateCode,
                                item = t.strContractStateName
                            };

        var orgchart = from t in office.ofcChartPositions
                       join t1 in office.ofcOrgPositions on t.numOrgPositionRef equals t1.numOrgPositionCode
                       where t.numOrgChartRef == 43
                       orderby t.numOrgPositionRef
                       select new
                       {
                           value = t.numOrgPositionRef,
                           item = t1.strOrgPositionName
                       };

        pltdDataContext pltd = new pltdDataContext(func.setapcstr.Trim());
        var person = from t in pltd.agcPersons
                     where t.numStatus == 1
                     select new
                     {
                         value = t.strPersonMelliCode,
                         item = t.strAgcName,
                         value2 = t.strHomePostCenterRef
                     };


        string json1 = serializer.Serialize((object)Marrid);
        string json2 = serializer.Serialize((object)privonce);
        string json3 = serializer.Serialize((object)city);
        string json4 = serializer.Serialize((object)ContractKinds);
        string json5 = serializer.Serialize((object)Employers);
        string json6 = serializer.Serialize((object)UnitOrganizations);
        string json7 = serializer.Serialize((object)jensiat);
        string json8 = serializer.Serialize((object)workgroup);
        string json9 = serializer.Serialize((object)person);
        string json10 = serializer.Serialize((object)contractstate);
        string json11 = serializer.Serialize((object)orgchart);

        string json = "[" + json1 + "," + json2 + "," + json3 + "," + json4 + "," + json5 + "," + json6 + "," + json7 + "," + json8 + "," + json9 + "," + json10 + "," + json11 + "]";
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //----------------------ثبت کارمند قرارداد موقت----------------------
    //---------------------------------------------------------------------
    public void RegisterPersonelMovaghat()
    {
        string EmployerCode = context.Request.Form["EmployerCode"];
        string name = context.Request.Form["name"];
        string family = context.Request.Form["family"];
        string fathername = context.Request.Form["fathername"];
        string mellicode = context.Request.Form["mellicode"];
        string NumberShenasname = context.Request.Form["NumberShenasname"];
        string dateBrithdayDate = context.Request.Form["dateBrithdayDate"];
        //  string BrithdayCityRef = context.Request.Form["BrithdayCityRef"];
        string ExportCityRef = context.Request.Form["ExportCityRef"];
        string Marrid = context.Request.Form["Marrid"];
        string Province = context.Request.Form["Province"];
        string City = context.Request.Form["City"];
        string PostCode = context.Request.Form["PostCode"];
        string tel = context.Request.Form["tel"];
        string mobile = context.Request.Form["mobile"];
        string jensiat = context.Request.Form["jensiat"];

        string PersonelAddress = context.Request.Form["PersonelAddress"];
        //string UnitOrganization = context.Request.Form["UnitOrganization"];
        string ContractKind = context.Request.Form["ContractKind"];
        string dateContractFromDate = context.Request.Form["dateContractFromDate"];
        string dateContractToDate = context.Request.Form["dateContractToDate"];
        //  string dateContractRegDate = context.Request.Form["dateContractRegDate"];
        string dateContractUnValidDate = context.Request.Form["dateContractUnValidDate"];
        string HoghogheSabet = context.Request.Form["HoghogheSabet"];
        string HaghMaskan = context.Request.Form["HaghMaskan"];
        string BonKharbar = context.Request.Form["BonKharbar"];
        string HaghOlad = context.Request.Form["HaghOlad"];
        string sanavat = context.Request.Form["sanavat"];
        string Moarefstatus = context.Request.Form["Moarefstatus"];
        string MoarefName = context.Request.Form["MoarefName"];
        string MoarefFamily = context.Request.Form["MoarefFamily"];
        string MoarefMobile = context.Request.Form["MoarefMobile"];
        string MoarefTel = context.Request.Form["MoarefTel"];
        string MoarefNesbat = context.Request.Form["MoarefNesbat"];
        string MoarefAddress = context.Request.Form["MoarefAddress"];
        string PadashAmalkard = context.Request.Form["PadashAmalkard"];
        string Saier = context.Request.Form["Saier"];
        string haghmasoliat = context.Request.Form["haghmasoliat"];
        string AyabZahab = context.Request.Form["AyabZahab"];

        string ContractMonth = context.Request.Form["ContractMonth"];
        string ContractDay = context.Request.Form["ContractDay"];
        string DoreFromDate = context.Request.Form["DoreFromDate"];
        string DoreToDate = context.Request.Form["DoreToDate"];
        string type = context.Request.Form["type"];
        int ReContract = Convert.ToInt32(context.Request.Form["ReContract"]);
        int PersonelCode = Convert.ToInt32(context.Request.Form["PersonelCode"]);
        int contractcode = Convert.ToInt32(context.Request.Form["contractcode"]);

        int CompletePeikInfo = Convert.ToInt32(context.Request.Form["CompletePeikInfo"]);

        string ischeckPriceJari = context.Request.Form["ischeckPriceJari"];
        string jariEjareh = context.Request.Form["jariEjareh"];
        string jariTel = context.Request.Form["jariTel"];
        string jariNet = context.Request.Form["jariNet"];
        string jariAbogaz = context.Request.Form["jariAbogaz"];
        string ischeckPriceporsant = context.Request.Form["ischeckPriceporsant"];
        string PorsantToziShode = context.Request.Form["PorsantToziShode"];
        string PorsantKharejMahdode = context.Request.Form["PorsantKharejMahdode"];
        string PorsantMoadeli = context.Request.Form["PorsantMoadeli"];

        string Contractstate = context.Request.Form["Contractstate"];
        string AgantMetraj = context.Request.Form["AgantMetraj"];
        string AnbarMetraj = context.Request.Form["AnbarMetraj"];
        string PriceZemanatNameh = context.Request.Form["PriceZemanatNameh"];
        string CountZemanatSafte = context.Request.Form["CountZemanatSafte"];
        string zemanatkind = context.Request.Form["zemanatkind"].Replace("\"", "");
        string strZemanatInfo = context.Request.Form["strZemanatInfo"];
        string companyname = context.Request.Form["companyname"];
        string shomaresabt = context.Request.Form["shomaresabt"];
        string CompanyKind = context.Request.Form["CompanyKind"];
        string SematInCompany = context.Request.Form["SematInCompany"];
        string owner = context.Request.Form["owner"];

        string CountZemanatCheck = context.Request.Form["CountZemanatCheck"];
        string strZemanatInfoCheck = context.Request.Form["strZemanatInfoCheck"];

        string orgchart = context.Request.Form["orgchart"];
        string agent = context.Request.Form["agent"];

        string transporterkind = context.Request.Form["transporterkind"];
        string transportName = context.Request.Form["transportName"];
        string transportmodel = context.Request.Form["transportmodel"];
        string transportcolor = context.Request.Form["transportcolor"];
        string transportsharhbani = context.Request.Form["transportsharhbani"];
        string transportshasi = context.Request.Form["transportshasi"];
        string transportbadaneh = context.Request.Form["transportbadaneh"];

        string json = "";

        if (type == "1" && ReContract == 0) // new contract
        {
            var checkMelliCode = office.ofcPersonels.Where(c => c.strMelliCode.Trim() == mellicode.Trim()).FirstOrDefault();
            if (checkMelliCode == null)
            {
                try
                {
                    int personelCode = 0;
                    if (Convert.ToInt16(jensiat) == 1) // mard
                    {
                        personelCode = Convert.ToInt32(office.ofcPersonels.Where(c => c.numPersonelCode >= 3000).Max(c => c.numPersonelCode));
                        if (personelCode == null || personelCode == 0) personelCode = 3000;
                        else personelCode = personelCode + 1;
                    }
                    else //zan
                    {
                        personelCode = Convert.ToInt32(office.ofcPersonels.Where(c => c.numPersonelCode >= 1000 && c.numPersonelCode <= 2999).Max(c => c.numPersonelCode));
                        if (personelCode == null || personelCode == 0) personelCode = 1000;
                        else personelCode = personelCode + 1;
                    }

                    ofcPersonel ofcpersonel = new ofcPersonel();
                    ofcpersonel.numMarridRef = Convert.ToInt16(Marrid);
                    ofcpersonel.numStatus = 0;
                    ofcpersonel.strNumberShenasname = NumberShenasname;
                    // ofcpersonel.strBrithdayCityRef = BrithdayCityRef;
                    ofcpersonel.strWorkCityRef = City;
                    ofcpersonel.strWorkProvinceRef = Province;
                    ofcpersonel.strExportCityRef = ExportCityRef;
                    ofcpersonel.strFatherName = fathername;
                    ofcpersonel.strMelliCode = mellicode;
                    ofcpersonel.strMobile = mobile;
                    ofcpersonel.strPersonalPass = mellicode;
                    ofcpersonel.strPersonelAddress = PersonelAddress;
                    ofcpersonel.strPersonelFamily = family;
                    ofcpersonel.strPersonelName = name;
                    ofcpersonel.strPostCode = PostCode;
                    ofcpersonel.strRegisterUserRef = _ofcUser.strUserCode;
                    ofcpersonel.strTel = tel;
                    ofcpersonel.dateBrithdayDate = dateBrithdayDate;
                    ofcpersonel.dateRegisterDate = _PDate.PersianDate;
                    ofcpersonel.timeRegisterTime = _PDate.PersianTime;
                    ofcpersonel.numEmployerRef = Convert.ToInt32(EmployerCode);
                    ofcpersonel.numJensiatRef = Convert.ToInt16(jensiat);
                    //ofcpersonel.numWorkGroupRef = 1; // default holding payegan bashe
                    ofcpersonel.numPersonelCode = personelCode;

                    ofcpersonel.strCompanyName = companyname;
                    ofcpersonel.strCompanyRegNumber = shomaresabt;
                    ofcpersonel.numCompanyType = Convert.ToInt16(CompanyKind);
                    ofcpersonel.numSematInCompany = Convert.ToInt16(SematInCompany);
                    ofcpersonel.numPerosnelCharacter = Convert.ToInt16(owner);

                    office.ofcPersonels.InsertOnSubmit(ofcpersonel);
                    // office.SubmitChanges();
                    //======================================================================================
                    if (Moarefstatus == "1")
                    {
                        office.ofcPersonelReagents.InsertOnSubmit(new ofcPersonelReagent
                        {
                            numPersonelRef = personelCode,
                            strReagentAddress = MoarefAddress,
                            strReagentFamily = MoarefFamily,
                            strReagentMobile = MoarefMobile,
                            strReagentName = MoarefName,
                            strReagentRelation = MoarefNesbat,
                            strReagentTel = MoarefTel,
                            timeRegisterTime = _PDate.PersianTime,
                            strRegisterUserRef = _ofcUser.strUserCode,
                            dateRegisterDate = _PDate.PersianDate,
                        });
                    }
                    //======================================================================================
                    ofcPersonelContract pContract = new ofcPersonelContract();
                    pContract.dateStartContractDate = dateContractFromDate;
                    pContract.dateEndContractDate = dateContractToDate;
                    pContract.dateUnvalidContractDate = dateContractUnValidDate;
                    pContract.numContractKindRef = Convert.ToInt16(ContractKind);
                    pContract.numPersonelBon = Convert.ToInt32(BonKharbar);
                    pContract.numPersonelChildSalary = Convert.ToInt32(HaghOlad);
                    pContract.numPersonelHomeSalary = Convert.ToInt32(HaghMaskan);
                    pContract.numPersonelRef = personelCode;
                    pContract.numPersonelSalary = Convert.ToInt32(HoghogheSabet);
                    pContract.numStatus = 1;
                    pContract.dateDoreFromDate = DoreFromDate;
                    pContract.dateDoreToDate = DoreToDate;
                    pContract.numPersonelPadash = Convert.ToInt32(PadashAmalkard);
                    pContract.numPersonelSaier = Convert.ToInt32(Saier);
                    pContract.numPriceHaghModiriat = Convert.ToInt32(haghmasoliat);
                    pContract.numPriceAyabZahab = Convert.ToInt32(AyabZahab);

                    pContract.numPersonelSanavat = Convert.ToInt32(sanavat);
                    pContract.strContractMonth = ContractMonth;
                    pContract.strContractDay = ContractDay;
                    pContract.timeRegisterTime = _PDate.PersianTime;
                    pContract.strRegisterUserRef = _ofcUser.strUserCode;
                    pContract.dateRegisterDate = _PDate.PersianDate;
                    pContract.dateCutWorkDate = dateContractToDate;
                    pContract.dateEstekhdamDate = _PDate.PersianDate;

                    pContract.numPriceJariEjareh = Convert.ToInt32(jariEjareh);
                    pContract.numPriceJariTel = Convert.ToInt32(jariTel);
                    pContract.numPriceJariNet = Convert.ToInt32(jariNet);
                    pContract.numPriceJariAbogaz = Convert.ToInt32(jariAbogaz);
                    pContract.numPricePorsantToziShode = Convert.ToInt32(PorsantToziShode);
                    pContract.numPricePorsantKharejMahdode = Convert.ToInt32(PorsantKharejMahdode);
                    pContract.numPricePorsantMoadeli = Convert.ToInt32(PorsantMoadeli);

                    pContract.numContractStateRef = Convert.ToInt32(Contractstate);
                    pContract.numAgentArea = Convert.ToInt32(AgantMetraj);
                    pContract.numAnbarArea = Convert.ToInt32(AnbarMetraj);
                    pContract.strZemanatType = zemanatkind;
                    pContract.numZemanatPrice = Convert.ToInt32(PriceZemanatNameh);
                    pContract.numCountZemanatSafteh = Convert.ToInt16(CountZemanatSafte);
                    pContract.strZemanatAllInfoSafteh = strZemanatInfo;
                    pContract.numCountZemanatCheck = Convert.ToInt16(CountZemanatCheck);
                    pContract.strZemanatAllInfoCheck = strZemanatInfoCheck;

                    office.ofcPersonelContracts.InsertOnSubmit(pContract);

                    office.SubmitChanges();
                    //======================================================================================
                    int numcode = pContract.numContractCode;
                    string uniqcontractCode = "";
                    string dateContractRegister = (_PDate.NowYear.Substring(2, _PDate.NowYear.Length - 2)) + "-" + _PDate.NowMonth + "-" + _PDate.NowDay;
                    if (numcode < 10) uniqcontractCode = dateContractRegister + "-0" + numcode.ToString();
                    else uniqcontractCode = dateContractRegister + "-" + numcode.ToString();
                    //======================================================================================
                    var contractCheck = office.ofcPersonelContracts.Where(c => c.numContractCode == numcode).FirstOrDefault();
                    if (contractCheck != null) contractCheck.StrContractUniqCode = uniqcontractCode;
                    //======================================================================================
                    //=======================================================================================
                    if (Contractstate == "2")
                    {
                        orgchart = orgchart.Replace("\"", "");
                        string[] orgchartArray = { "" };

                        if (orgchart != "-1")
                        {
                            orgchartArray = orgchart.Split(',').Where(c => !(String.IsNullOrEmpty(c))).ToArray();
                            orgchart = "";
                        }

                        foreach (var items in orgchartArray)
                        {
                            var qorgchart = office.ofcChartPositions.Where(c => c.numOrgChartRef == 43 && c.numOrgPositionRef == Convert.ToInt32(items)).FirstOrDefault();
                            if (qorgchart != null)
                            {
                                office.ofcPersonelChartPositions.InsertOnSubmit(new ofcPersonelChartPosition
                                {
                                    numPersonelRef = personelCode,
                                    numChartPositionRef = Convert.ToInt32(qorgchart.numChartPositionCode),
                                    numContractRef = numcode,
                                });
                            }
                        }

                        if (agent != "-1" && agent != "")
                        {
                            office.ofcPersonelAssignAgents.InsertOnSubmit(new ofcPersonelAssignAgent
                            {
                                numPersonelRef = personelCode,
                                numContractRef = numcode,
                                strPersonMelliRef = agent
                            });
                        }

                        if (transporterkind != "0")
                        {
                            office.ofcPersonelTransporterKinds.InsertOnSubmit(new ofcPersonelTransporterKind
                            {
                                numPersonelRef = personelCode,
                                numTransporterKind = Convert.ToByte(transporterkind),
                                strColor = transportcolor,
                                strModel = transportmodel,
                                strNumBody = transportbadaneh,
                                strNumShahrbani = transportsharhbani,
                                strNumShasi = transportshasi,
                                strOwnerName = transportName,
                                numContractRef = numcode
                            });
                        }
                    }
                    //======================================================================================

                    if (CompletePeikInfo == 1)
                    {
                        var checkPeik = office.ofcPrePersonels.Where(c => c.strMelliCode.Trim() == mellicode.Trim() && c.numStatus == 0).FirstOrDefault();
                        checkPeik.numStatus = 1;
                        checkPeik.numPersonelRef = personelCode;
                    }

                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1^" + personelCode.ToString()); // sabt shod

                }
                catch
                {
                    json = serializer.Serialize((object)"3"); // khata
                }

            }
            else
            {
                json = serializer.Serialize((object)"2"); //code melli tekrari
            }
        }
        if (type == "1" && ReContract == 1) // new Recontract
        {
            var ofcpersonel = office.ofcPersonels.Where(c => c.numPersonelCode == PersonelCode).FirstOrDefault();
            if (ofcpersonel != null)
            {
                try
                {
                    ofcpersonel.numMarridRef = Convert.ToInt16(Marrid);
                    ofcpersonel.numStatus = 0;
                    ofcpersonel.strNumberShenasname = NumberShenasname;
                    // ofcpersonel.strBrithdayCityRef = BrithdayCityRef;
                    ofcpersonel.strWorkCityRef = City;
                    ofcpersonel.strWorkProvinceRef = Province;
                    ofcpersonel.strExportCityRef = ExportCityRef;
                    ofcpersonel.strFatherName = fathername;
                    ofcpersonel.strMelliCode = mellicode;
                    ofcpersonel.strMobile = mobile;
                    ofcpersonel.strPersonalPass = mellicode;
                    ofcpersonel.strPersonelAddress = PersonelAddress;
                    ofcpersonel.strPersonelFamily = family;
                    ofcpersonel.strPersonelName = name;
                    ofcpersonel.strPostCode = PostCode;
                    ofcpersonel.strRegisterUserRef = _ofcUser.strUserCode;
                    ofcpersonel.strTel = tel;
                    ofcpersonel.dateBrithdayDate = dateBrithdayDate;
                    ofcpersonel.dateRegisterDate = _PDate.PersianDate;
                    ofcpersonel.timeRegisterTime = _PDate.PersianTime;
                    ofcpersonel.numEmployerRef = Convert.ToInt32(EmployerCode);
                    ofcpersonel.numJensiatRef = Convert.ToInt16(jensiat);
                    ofcpersonel.strCompanyName = companyname;
                    ofcpersonel.strCompanyRegNumber = shomaresabt;
                    ofcpersonel.numCompanyType = Convert.ToInt16(CompanyKind);
                    ofcpersonel.numSematInCompany = Convert.ToInt16(SematInCompany);
                    ofcpersonel.numPerosnelCharacter = Convert.ToInt16(owner);
                    // office.SubmitChanges();
                    //======================================================================================
                    if (Moarefstatus == "1")
                    {
                        var checkMoaref = office.ofcPersonelReagents.Where(c => c.numPersonelRef == PersonelCode).FirstOrDefault();
                        if (checkMoaref != null)
                        {
                            checkMoaref.strReagentAddress = MoarefAddress;
                            checkMoaref.strReagentFamily = MoarefFamily;
                            checkMoaref.strReagentMobile = MoarefMobile;
                            checkMoaref.strReagentName = MoarefName;
                            checkMoaref.strReagentRelation = MoarefNesbat;
                            checkMoaref.strReagentTel = MoarefTel;
                            checkMoaref.timeRegisterTime = _PDate.PersianTime;
                            checkMoaref.strRegisterUserRef = _ofcUser.strUserCode;
                            checkMoaref.dateRegisterDate = _PDate.PersianDate;
                        }
                        else
                        {
                            office.ofcPersonelReagents.InsertOnSubmit(new ofcPersonelReagent
                            {
                                numPersonelRef = PersonelCode,
                                strReagentAddress = MoarefAddress,
                                strReagentFamily = MoarefFamily,
                                strReagentMobile = MoarefMobile,
                                strReagentName = MoarefName,
                                strReagentRelation = MoarefNesbat,
                                strReagentTel = MoarefTel,
                                timeRegisterTime = _PDate.PersianTime,
                                strRegisterUserRef = _ofcUser.strUserCode,
                                dateRegisterDate = _PDate.PersianDate,
                            });
                        }
                    }
                    //======================================================================================
                    var checkContractActive = office.ofcPersonelContracts.Where(c => c.numPersonelRef == PersonelCode && c.numStatus == 1).FirstOrDefault();
                    if (checkContractActive != null) checkContractActive.numStatus = 0; // ghire faal kardane gharardade feli

                    ofcPersonelContract pContract = new ofcPersonelContract();

                    //pContract.numWorkGroupRef = checkContractActive.numWorkGroupRef;

                    pContract.dateStartContractDate = dateContractFromDate;
                    pContract.dateEndContractDate = dateContractToDate;
                    pContract.dateUnvalidContractDate = dateContractUnValidDate;
                    pContract.numContractKindRef = Convert.ToInt16(ContractKind);
                    pContract.numPersonelBon = Convert.ToInt32(BonKharbar);
                    pContract.numPersonelChildSalary = Convert.ToInt32(HaghOlad);
                    pContract.numPersonelHomeSalary = Convert.ToInt32(HaghMaskan);
                    pContract.numPersonelRef = PersonelCode;
                    pContract.numPersonelSalary = Convert.ToInt32(HoghogheSabet);
                    pContract.numStatus = 1;
                    pContract.dateDoreFromDate = DoreFromDate;
                    pContract.dateDoreToDate = DoreToDate;
                    pContract.numPersonelPadash = Convert.ToInt32(PadashAmalkard);
                    pContract.numPersonelSaier = Convert.ToInt32(Saier);
                    pContract.numPriceHaghModiriat = Convert.ToInt32(haghmasoliat);
                    pContract.numPriceAyabZahab = Convert.ToInt32(AyabZahab);

                    pContract.numPersonelSanavat = Convert.ToInt32(sanavat);
                    pContract.strContractMonth = ContractMonth;
                    pContract.strContractDay = ContractDay;
                    pContract.timeRegisterTime = _PDate.PersianTime;
                    pContract.strRegisterUserRef = _ofcUser.strUserCode;
                    pContract.dateRegisterDate = _PDate.PersianDate;
                    pContract.dateCutWorkDate = dateContractToDate;
                    pContract.dateEstekhdamDate = _PDate.PersianDate;
                    pContract.numPriceJariEjareh = Convert.ToInt32(jariEjareh);
                    pContract.numPriceJariTel = Convert.ToInt32(jariTel);
                    pContract.numPriceJariNet = Convert.ToInt32(jariNet);
                    pContract.numPriceJariAbogaz = Convert.ToInt32(jariAbogaz);
                    pContract.numPricePorsantToziShode = Convert.ToInt32(PorsantToziShode);
                    pContract.numPricePorsantKharejMahdode = Convert.ToInt32(PorsantKharejMahdode);
                    pContract.numPricePorsantMoadeli = Convert.ToInt32(PorsantMoadeli);

                    pContract.numContractStateRef = Convert.ToInt32(Contractstate);
                    pContract.numAgentArea = Convert.ToInt32(AgantMetraj);
                    pContract.numAnbarArea = Convert.ToInt32(AnbarMetraj);
                    pContract.strZemanatType = zemanatkind;
                    pContract.numZemanatPrice = Convert.ToInt32(PriceZemanatNameh);
                    pContract.numCountZemanatSafteh = Convert.ToInt16(CountZemanatSafte);
                    pContract.strZemanatAllInfoSafteh = strZemanatInfo;
                    pContract.numCountZemanatCheck = Convert.ToInt16(CountZemanatCheck);
                    pContract.strZemanatAllInfoCheck = strZemanatInfoCheck;

                    office.ofcPersonelContracts.InsertOnSubmit(pContract);
                    office.SubmitChanges();
                    //======================================================================================
                    int numcode = pContract.numContractCode;
                    string uniqcontractCode = "";
                    string dateContractRegister = (_PDate.NowYear.Substring(2, _PDate.NowYear.Length - 2)) + "-" + _PDate.NowMonth + "-" + _PDate.NowDay;
                    if (numcode < 10) uniqcontractCode = dateContractRegister + "-0" + numcode.ToString();
                    else uniqcontractCode = dateContractRegister + "-" + numcode.ToString();
                    //======================================================================================
                    var contractCheck = office.ofcPersonelContracts.Where(c => c.numContractCode == numcode).FirstOrDefault();
                    if (contractCheck != null) contractCheck.StrContractUniqCode = uniqcontractCode;
                    //======================================================================================
                    if (Contractstate == "2")
                    {
                        orgchart = orgchart.Replace("\"", "");
                        string[] orgchartArray = { "" };

                        if (orgchart != "-1")
                        {
                            orgchartArray = orgchart.Split(',').Where(c => !(String.IsNullOrEmpty(c))).ToArray();
                            orgchart = "";
                        }

                        foreach (var items in orgchartArray)
                        {
                            var qorgchart = office.ofcChartPositions.Where(c => c.numOrgChartRef == 43 && c.numOrgPositionRef == Convert.ToInt32(items)).FirstOrDefault();
                            if (qorgchart != null)
                            {
                                var checkpersonelchart = office.ofcPersonelChartPositions.Where(c => c.numPersonelRef == PersonelCode && c.numChartPositionRef == Convert.ToInt32(qorgchart.numChartPositionCode) && c.numContractRef == numcode).FirstOrDefault();
                                if (checkpersonelchart == null)
                                {
                                    office.ofcPersonelChartPositions.InsertOnSubmit(new ofcPersonelChartPosition
                                    {
                                        numPersonelRef = PersonelCode,
                                        numChartPositionRef = Convert.ToInt32(qorgchart.numChartPositionCode),
                                        numContractRef = numcode,
                                    });
                                }
                            }
                        }

                        if (agent != "-1" && agent != "")
                        {
                            office.ofcPersonelAssignAgents.InsertOnSubmit(new ofcPersonelAssignAgent
                            {
                                numPersonelRef = PersonelCode,
                                numContractRef = numcode,
                                strPersonMelliRef = agent
                            });
                        }


                        if (transporterkind != "0")
                        {
                            office.ofcPersonelTransporterKinds.InsertOnSubmit(new ofcPersonelTransporterKind
                            {
                                numPersonelRef = PersonelCode,
                                numTransporterKind = Convert.ToByte(transporterkind),
                                strColor = transportcolor,
                                strModel = transportmodel,
                                strNumBody = transportbadaneh,
                                strNumShahrbani = transportsharhbani,
                                strNumShasi = transportshasi,
                                strOwnerName = transportName,
                                numContractRef = numcode
                            });
                        }
                    }
                    //======================================================================================
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1"); // sabt shod
                }
                catch
                {
                    json = serializer.Serialize((object)"3"); // khata
                }

            }
            else
            {
                json = serializer.Serialize((object)"2"); //personel not found
            }
        }
        else if (type == "3") //===============================edit==============================
        {
            var checkMelliCode = office.ofcPersonels.Where(c => c.strMelliCode.Trim() == mellicode.Trim()).FirstOrDefault();
            if (checkMelliCode != null)
            {
                try
                {
                    checkMelliCode.numMarridRef = Convert.ToInt16(Marrid);
                    checkMelliCode.strNumberShenasname = NumberShenasname;
                    checkMelliCode.strWorkCityRef = City;
                    checkMelliCode.strWorkProvinceRef = Province;
                    checkMelliCode.strExportCityRef = ExportCityRef;
                    checkMelliCode.strFatherName = fathername;
                    checkMelliCode.strMelliCode = mellicode;
                    checkMelliCode.strMobile = mobile;
                    checkMelliCode.strPersonalPass = mellicode;
                    checkMelliCode.strPersonelAddress = PersonelAddress;
                    checkMelliCode.strPersonelFamily = family;
                    checkMelliCode.strPersonelName = name;
                    checkMelliCode.strPostCode = PostCode;
                    checkMelliCode.strRegisterUserRef = _ofcUser.strUserCode;
                    checkMelliCode.strTel = tel;
                    checkMelliCode.dateBrithdayDate = dateBrithdayDate;
                    checkMelliCode.dateRegisterDate = _PDate.PersianDate;
                    checkMelliCode.timeRegisterTime = _PDate.PersianTime;
                    checkMelliCode.numEmployerRef = Convert.ToInt32(EmployerCode);
                    checkMelliCode.numJensiatRef = Convert.ToInt16(jensiat);
                    checkMelliCode.strCompanyName = companyname;
                    checkMelliCode.strCompanyRegNumber = shomaresabt;
                    checkMelliCode.numCompanyType = Convert.ToInt16(CompanyKind);
                    checkMelliCode.numSematInCompany = Convert.ToInt16(SematInCompany);
                    checkMelliCode.numPerosnelCharacter = Convert.ToInt16(owner);

                    //==================================================================
                    var checkContract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == checkMelliCode.numPersonelCode && c.numContractCode == contractcode && c.numStatus == 1).FirstOrDefault();
                    if (checkContract != null)
                    {
                        checkContract.dateStartContractDate = dateContractFromDate;
                        checkContract.dateEndContractDate = dateContractToDate;
                        checkContract.dateCutWorkDate = dateContractToDate;
                        checkContract.dateUnvalidContractDate = dateContractUnValidDate;
                        // checkContract.numContractKindRef = Convert.ToInt16(ContractKind);
                        checkContract.numPersonelBon = Convert.ToInt32(BonKharbar);
                        checkContract.numPersonelChildSalary = Convert.ToInt32(HaghOlad);
                        checkContract.numPersonelHomeSalary = Convert.ToInt32(HaghMaskan);
                        checkContract.numPersonelSalary = Convert.ToInt32(HoghogheSabet);
                        checkContract.dateDoreFromDate = DoreFromDate;
                        checkContract.dateDoreToDate = DoreToDate;
                        checkContract.numPersonelPadash = Convert.ToInt32(PadashAmalkard);
                        checkContract.numPersonelSaier = Convert.ToInt32(Saier);
                        checkContract.numPriceHaghModiriat = Convert.ToInt32(haghmasoliat);
                        checkContract.numPriceAyabZahab = Convert.ToInt32(AyabZahab);

                        checkContract.numPersonelSanavat = Convert.ToInt32(sanavat);
                        checkContract.strContractMonth = ContractMonth;
                        checkContract.strContractDay = ContractDay;
                        checkContract.timeRegisterTime = _PDate.PersianTime;
                        checkContract.strRegisterUserRef = _ofcUser.strUserCode;
                        checkContract.dateRegisterDate = _PDate.PersianDate;

                        checkContract.numPriceJariEjareh = Convert.ToInt32(jariEjareh);
                        checkContract.numPriceJariTel = Convert.ToInt32(jariTel);
                        checkContract.numPriceJariNet = Convert.ToInt32(jariNet);
                        checkContract.numPriceJariAbogaz = Convert.ToInt32(jariAbogaz);
                        checkContract.numPricePorsantToziShode = Convert.ToInt32(PorsantToziShode);
                        checkContract.numPricePorsantKharejMahdode = Convert.ToInt32(PorsantKharejMahdode);
                        checkContract.numPricePorsantMoadeli = Convert.ToInt32(PorsantMoadeli);

                        checkContract.numContractStateRef = Convert.ToInt32(Contractstate);
                        checkContract.numAgentArea = Convert.ToInt32(AgantMetraj);
                        checkContract.numAnbarArea = Convert.ToInt32(AnbarMetraj);
                        checkContract.strZemanatType = zemanatkind;
                        checkContract.numZemanatPrice = Convert.ToInt32(PriceZemanatNameh);
                        checkContract.numCountZemanatSafteh = Convert.ToInt16(CountZemanatSafte);
                        checkContract.strZemanatAllInfoSafteh = strZemanatInfo;
                        checkContract.numCountZemanatCheck = Convert.ToInt16(CountZemanatCheck);
                        checkContract.strZemanatAllInfoCheck = strZemanatInfoCheck;

                        //=======================================================================================
                        if (Contractstate == "2")
                        {
                            orgchart = orgchart.Replace("\"", "");
                            string[] orgchartArray = { "" };

                            if (orgchart != "-1")
                            {
                                orgchartArray = orgchart.Split(',').Where(c => !(String.IsNullOrEmpty(c))).ToArray();
                                orgchart = "";
                            }

                            var checkpersonelchart1 = office.ofcPersonelChartPositions.Where(c => c.numPersonelRef == checkMelliCode.numPersonelCode && c.numContractRef == checkContract.numContractCode);
                            if (checkpersonelchart1.Any())
                            {
                                office.ofcPersonelChartPositions.DeleteAllOnSubmit(checkpersonelchart1);
                                try { office.SubmitChanges(); } catch { }
                            }

                            foreach (var items in orgchartArray)
                            {
                                var qorgchart = office.ofcChartPositions.Where(c => c.numOrgChartRef == 43 && c.numOrgPositionRef == Convert.ToInt32(items)).FirstOrDefault();
                                if (qorgchart != null)
                                {
                                    var checkpersonelchart = office.ofcPersonelChartPositions.Where(c => c.numPersonelRef == checkMelliCode.numPersonelCode && c.numChartPositionRef == Convert.ToInt32(qorgchart.numChartPositionCode) && c.numContractRef == checkContract.numContractCode).FirstOrDefault();
                                    if (checkpersonelchart == null)
                                    {
                                        office.ofcPersonelChartPositions.InsertOnSubmit(new ofcPersonelChartPosition
                                        {
                                            numPersonelRef = checkMelliCode.numPersonelCode,
                                            numChartPositionRef = Convert.ToInt32(qorgchart.numChartPositionCode),
                                            numContractRef = checkContract.numContractCode,
                                        });
                                    }
                                }
                            }


                            //==============================================================================
                            var checkAssignAgent = office.ofcPersonelAssignAgents.Where(c => c.numPersonelRef == checkMelliCode.numPersonelCode && c.numContractRef == checkContract.numContractCode);
                            if (checkAssignAgent.Any())
                            {
                                office.ofcPersonelAssignAgents.DeleteAllOnSubmit(checkAssignAgent);
                                try { office.SubmitChanges(); } catch { }
                            }
                            if (agent != "-1" && agent != "")
                            {
                                office.ofcPersonelAssignAgents.InsertOnSubmit(new ofcPersonelAssignAgent
                                {
                                    numPersonelRef = checkMelliCode.numPersonelCode,
                                    numContractRef = checkContract.numContractCode,
                                    strPersonMelliRef = agent
                                });
                            }
                            //======================================================================================
                            var checkTransporterKind = office.ofcPersonelTransporterKinds.Where(c => c.numPersonelRef == checkMelliCode.numPersonelCode && c.numContractRef == checkContract.numContractCode);
                            if (checkTransporterKind.Any())
                            {
                                office.ofcPersonelTransporterKinds.DeleteAllOnSubmit(checkTransporterKind);
                                try { office.SubmitChanges(); } catch { }
                            }
                            if (transporterkind != "0")
                            {
                                office.ofcPersonelTransporterKinds.InsertOnSubmit(new ofcPersonelTransporterKind
                                {
                                    numPersonelRef = checkMelliCode.numPersonelCode,
                                    numTransporterKind = Convert.ToByte(transporterkind),
                                    strColor = transportcolor,
                                    strModel = transportmodel,
                                    strNumBody = transportbadaneh,
                                    strNumShahrbani = transportsharhbani,
                                    strNumShasi = transportshasi,
                                    strOwnerName = transportName,
                                    numContractRef = checkContract.numContractCode,
                                });
                            }
                        }


                    }
                    //==================================================================
                    if (Moarefstatus == "1")
                    {
                        var checkMoaref = office.ofcPersonelReagents.Where(c => c.numPersonelRef == checkMelliCode.numPersonelCode).FirstOrDefault();
                        if (checkMoaref == null)
                        {
                            office.ofcPersonelReagents.InsertOnSubmit(new ofcPersonelReagent
                            {
                                numPersonelRef = checkMelliCode.numPersonelCode,
                                strReagentAddress = MoarefAddress,
                                strReagentFamily = MoarefFamily,
                                strReagentMobile = MoarefMobile,
                                strReagentName = MoarefName,
                                strReagentRelation = MoarefNesbat,
                                strReagentTel = MoarefTel,
                                timeRegisterTime = _PDate.PersianTime,
                                strRegisterUserRef = _ofcUser.strUserCode,
                                dateRegisterDate = _PDate.PersianDate,
                            });
                        }
                        else
                        {
                            checkMoaref.strReagentAddress = MoarefAddress;
                            checkMoaref.strReagentFamily = MoarefFamily;
                            checkMoaref.strReagentMobile = MoarefMobile;
                            checkMoaref.strReagentName = MoarefName;
                            checkMoaref.strReagentRelation = MoarefNesbat;
                            checkMoaref.strReagentTel = MoarefTel;
                            checkMoaref.timeRegisterTime = _PDate.PersianTime;
                            checkMoaref.strRegisterUserRef = _ofcUser.strUserCode;
                            checkMoaref.dateRegisterDate = _PDate.PersianDate;
                        }
                    }
                    else
                    {
                        var checkMoaref2 = office.ofcPersonelReagents.Where(c => c.numPersonelRef == checkMelliCode.numPersonelCode).FirstOrDefault();
                        if (checkMoaref2 != null)
                        {
                            office.ofcPersonelReagents.DeleteOnSubmit(checkMoaref2);
                        }
                    }

                    office.SubmitChanges();
                    json = serializer.Serialize((object)"6"); //edit ok
                }
                catch
                {
                    json = serializer.Serialize((object)"5"); //khata edit
                }
            }
            else
            {
                json = serializer.Serialize((object)"4"); //yaft nashod
            }
        }
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
        string Contractstate = context.Request.Form["Contractstate"];

        string Employer = context.Request.Form["Employer"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string DateFrom = context.Request.Form["DateFrom"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        string DateTo = context.Request.Form["DateTo"];
        int status = Convert.ToInt32(context.Request.Form["status"]);
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;

        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }

        var personel = (from t in office.ofcPersonels
                            // join t1 in office.ofcBMarrids on t.numMarridRef equals t1.numMarridCode into t1_joined
                            // from t1 in t1_joined.DefaultIfEmpty()
                        join t2 in office.ofcPersonelContracts on t.numPersonelCode equals t2.numPersonelRef
                        join t3 in office.ofcBContractKinds on t2.numContractKindRef equals t3.numContractKindCode
                        join t4 in office.ofcBEmployers on t.numEmployerRef equals t4.numEmployerCode
                        join t6 in office.ofcBContractStates on t2.numContractStateRef equals t6.numContractStateCode
                        join t5 in office.ofcBWorkGroups on t2.numWorkGroupRef equals t5.numWorkGroupCode into t5_joined
                        from t5 in t5_joined.DefaultIfEmpty()
                            //join t5 in office.ofcPersonelFileUploadeds on t.numPersonelCode equals t5.numPersonelRef into t5_joined
                            //from t5 in t5_joined.DefaultIfEmpty()
                        where
                             (t.numEmployerRef == Convert.ToInt32(Employer) || Employer == "-1")
                             &&
                             (t2.numContractKindRef == Convert.ToInt32(ContractKind) || ContractKind == "-1")
                             &&
                             (t2.numContractStateRef == Convert.ToInt32(Contractstate) || Contractstate == "-1")
                             &&
                            ((t.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            (t.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            name == "")
                            &&
                            (((grohkariRoomArray).Contains(t2.numWorkGroupRef.ToString()) || ((grohkariRoomArray).Contains("-2") && t2.numWorkGroupRef == null)) || grohkari == "-1")
                            &&
                            (t.strMelliCode == mellicode || mellicode == "")
                            &&
                            (t.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                            &&
                            (string.Compare(t2.dateStartContractDate, DateFrom) >= 0 && string.Compare(t2.dateStartContractDate, DateTo) <= 0)
                            &&
                            ((t2.numStatus == 1 && (status == 1 || status == 2 || status == 4) && t.numStatus == status)
                            ||
                            (t2.numStatus == 0 && status == 3 && (((t.numStatus != 3 && (office.ofcPersonelContracts.Where(c => c.numPersonelRef == t.numPersonelCode).OrderByDescending(c => c.numContractCode).Take(1).FirstOrDefault().numStatus) == 1) || (t.numStatus == 3 && (office.ofcPersonelContracts.Where(c => c.numPersonelRef == t.numPersonelCode).OrderByDescending(c => c.numContractCode).Take(1).FirstOrDefault().numStatus) == 0))))
                            ||
                            (t2.numStatus == 0 && t.numStatus != 3 && status == -2 && (office.ofcPersonelContracts.Where(c => c.numPersonelRef == t.numPersonelCode).OrderByDescending(c => c.numContractCode).Take(1).FirstOrDefault().numStatus) == 0)
                            ||
                            status == -1) // && (new int[] { 1, 2, 3 }).Contains((int)t.numStatus)))

                        //&&
                        //(t5 != null && t5.numFileType == 10)
                        select new
                        {
                            PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                            t.numPersonelCode,
                            //t.strFatherName,
                            t.strMelliCode,
                            t.strNumberShenasname,
                            dateBrithdayDate = t.dateBrithdayDate == null ? "--" : t.dateBrithdayDate,
                            t2.dateStartContractDate,
                            t6.strContractStateName,
                            //t2.strReligionName,
                            //t.strGilderName,
                            //strMarridName = t1.strMarridName == null ? "--" : t1.strMarridName,
                            t3.strContractKindName,
                            t4.strEmployerName,
                            strUploadImage = "", //t5.strUploadImage
                            t.numStatus,
                            t5.strWorkGroupName,
                            numStatusContract = t2.numStatus,
                            t2.numContractCode,
                            dateCutWorkDate = t2.dateCutWorkDate == null ? "--" : t2.dateCutWorkDate,
                            cntcontract = (office.ofcPersonelContracts.Where(c => c.numPersonelRef == t.numPersonelCode).Count()),
                            laststatuscontract = (office.ofcPersonelContracts.Where(c => c.numPersonelRef == t.numPersonelCode).OrderByDescending(c => c.numContractCode).Take(1).FirstOrDefault().numStatus),
                        });
        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = personel.Count();
        var query = personel.OrderBy(o => o.dateStartContractDate).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);

        int Isvalid = 0;
        if ((new string[] { "0077567722", "20800736", "2120264392", "0012937142", "0520168062", "74296094" }).Contains(_ofcUser.strUserCode.Trim())) Isvalid = 1;

        string bothJson = "[" + json + "," + AllRecrdCount + "," + Isvalid + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-------------دریافت اطلاعات پرسنلی برای بارگزاری مدرک-------------
    //----------------------------------------------------------------------
    private void GetReportPersonelContract()
    {
        string ContractKind = context.Request.Form["ContractKind"];
        string Employer = context.Request.Form["Employer"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        string ContractState = context.Request.Form["ContractState"];

        ContractKind = String.IsNullOrEmpty(ContractKind) ? "-1" : ContractKind;
        ContractState = String.IsNullOrEmpty(ContractState) ? "-1" : ContractState;
        Employer = String.IsNullOrEmpty(Employer) ? "-1" : Employer;

        var personel = (from t in office.ofcPersonels
                        join t2 in office.ofcPersonelContracts on t.numPersonelCode equals t2.numPersonelRef
                        join t3 in office.ofcBContractKinds on t2.numContractKindRef equals t3.numContractKindCode
                        join t4 in office.ofcBEmployers on t.numEmployerRef equals t4.numEmployerCode
                        join t6 in office.ofcBContractStates on t2.numContractStateRef equals t6.numContractStateCode
                        join t5 in office.ofcPrePersonels on t.numPersonelCode equals t5.numPersonelRef into t5_joined
                        from t5 in t5_joined.DefaultIfEmpty()
                        where
                            (t.numEmployerRef == Convert.ToInt32(Employer) || Employer == "-1")
                            &&
                            (t2.numContractKindRef == Convert.ToInt32(ContractKind) || ContractKind == "-1")
                            &&
                            ((t.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            (t.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            name == "")
                            &&
                            (t.strMelliCode == mellicode || mellicode == "")
                            &&
                            (t.numStatus == 0)
                            &&
                            t2.numStatus == 1
                            &&
                            (t2.numContractStateRef == Convert.ToInt32(ContractState) || ContractState == "-1")

                        select new
                        {
                            PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                            t.strFatherName,
                            t.strMelliCode,
                            t.strNumberShenasname,
                            t.dateRegisterDate,
                            t3.strContractKindName,
                            t4.strEmployerName,
                            t2.StrContractUniqCode,
                            t2.numContractCode,
                            isPeik = t5.numPersonelRef == null ? 0 : 1,
                            t6.strContractStateName
                        });


        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = personel.Count();
        var query = personel.OrderBy(o => o.dateRegisterDate).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------آپلود اسکن قرارداد-----------------------
    //---------------------------------------------------------------------
    public void UploadFileContract()
    {
        string melliCode = context.Request.Form["melliCode"];
        HttpPostedFile postedFile = context.Request.Files["UpFile"];
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        string json = "", fname = "";
        string Type = "10";
        var personelCode = office.ofcPersonels.Where(c => c.strMelliCode.Trim() == melliCode.Trim() && c.numStatus == 0).FirstOrDefault();
        if (personelCode != null)
        {
            //----------------------------------------------------------SendFile--------------------------------------------------
            string savepath = HttpContext.Current.Server.MapPath("~/Images/PersonelImge/");
            var extension = Path.GetExtension(postedFile.FileName).ToLower();
            if (extension.Trim().ToLower() == ".jpg" || extension.Trim().ToLower() == ".png" || extension.Trim().ToLower() == ".gif" || extension.Trim().ToLower() == ".gpeg")
            {//fname = postedFile.FileName.Remove((postedFile.FileName.Length - extension.Length));
                string unicode = _ofcUser.strUserCode.Trim() + "_" + Type + "_" + _PDate.NowYear + _PDate.NowMonth + _PDate.NowDay + DateTime.Now.Hour.ToString() + DateTime.Now.Minute.ToString() + DateTime.Now.Second.ToString();
                fname = fname + unicode + extension;
                savepath += fname;
                if (!File.Exists(savepath))
                {
                    postedFile.SaveAs(savepath);
                }

                office.ofcPersonelFileUploadeds.InsertOnSubmit(new ofcPersonelFileUploaded
                {
                    numPersonelRef = personelCode.numPersonelCode,
                    strRegisterUserRef = _ofcUser.strUserCode,
                    dateRegisterDate = _PDate.PersianDate,
                    numFileType = Convert.ToInt16(Type),
                    strUploadImage = fname
                });

                try
                {
                    personelCode.numStatus = 1;
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1^" + personelCode.numPersonelCode.ToString()); // sabt shod
                }
                catch
                {
                    json = serializer.Serialize((object)"4"); // khata
                }
            }
            else
            {
                json = serializer.Serialize((object)"2");
            }
        }
        else
        {
            json = serializer.Serialize((object)"3");
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------ثبت کارمند قرارداد ساعتی و پیمانکاری---------------
    //---------------------------------------------------------------------
    public void RegisterPersonelProjectAndSaati()
    {
        string EmployerCode = context.Request.Form["EmployerCode"];
        string name = context.Request.Form["name"];
        string family = context.Request.Form["family"];
        string mellicode = context.Request.Form["mellicode"];
        string NumberShenasname = context.Request.Form["NumberShenasname"];
        string ExportCityRef = context.Request.Form["ExportCityRef"];
        string jensiat = context.Request.Form["jensiat"];
        string PersonelAddress = context.Request.Form["PersonelAddress"];
        string ContractKind = context.Request.Form["ContractKind"];
        string dateContractFromDate = context.Request.Form["dateContractFromDate"];
        string dateContractToDate = context.Request.Form["dateContractToDate"];
        string ContractDateTavafogh = context.Request.Form["ContractDateTavafogh"];
        string HoghogheSabet = context.Request.Form["HoghogheSabet"];
        string ContractMonth = context.Request.Form["ContractMonth"];
        string ContractDay = context.Request.Form["ContractDay"];
        string khadamat = context.Request.Form["khadamat"];
        string karkardRozane = context.Request.Form["karkardRozane"];
        string tel = context.Request.Form["tel"];
        string Mobile = context.Request.Form["mobile"];

        string Province = context.Request.Form["Province"];
        string City = context.Request.Form["City"];

        string fatehrName = context.Request.Form["fatehrName"];
        string SaatiPriceEndKind = context.Request.Form["SaatiPriceEndKind"];
        string TitlePadashContract = context.Request.Form["TitlePadashContract"];

        int ReContract = Convert.ToInt32(context.Request.Form["ReContract"]);
        int PersonelCode = Convert.ToInt32(context.Request.Form["PersonelCode"]);
        int contractcode = Convert.ToInt32(context.Request.Form["contractcode"]);
        int type = Convert.ToInt32(context.Request.Form["type"]);
        int CompletePeikInfo = Convert.ToInt32(context.Request.Form["CompletePeikInfo"]);

        string TimeForMonth = context.Request.Form["TimeForMonth"];
        string WeekForMonth = context.Request.Form["WeekForMonth"];
        string Padash = context.Request.Form["Padash"];
        string haghmodiriat = context.Request.Form["haghmodiriat"];
        karkardRozane = karkardRozane + "-" + TimeForMonth + "-" + WeekForMonth;
        string ischeckPriceJari = context.Request.Form["ischeckPriceJari"];
        string jariEjareh = context.Request.Form["jariEjareh"];
        string jariTel = context.Request.Form["jariTel"];
        string jariNet = context.Request.Form["jariNet"];
        string jariAbogaz = context.Request.Form["jariAbogaz"];
        string ischeckPriceporsant = context.Request.Form["ischeckPriceporsant"];
        string PorsantToziShode = context.Request.Form["PorsantToziShode"];
        string PorsantKharejMahdode = context.Request.Form["PorsantKharejMahdode"];
        string PorsantMoadeli = context.Request.Form["PorsantMoadeli"];

        string Contractstate = context.Request.Form["Contractstate"];
        string AgantMetraj = context.Request.Form["AgantMetraj"];
        string AnbarMetraj = context.Request.Form["AnbarMetraj"];
        string PriceZemanatNameh = context.Request.Form["PriceZemanatNameh"];
        string CountZemanatSafte = context.Request.Form["CountZemanatSafte"];
        string zemanatkind = context.Request.Form["zemanatkind"].Replace("\"", "");
        string strZemanatInfo = context.Request.Form["strZemanatInfo"];
        string companyname = context.Request.Form["companyname"];
        string shomaresabt = context.Request.Form["shomaresabt"];
        string CompanyKind = context.Request.Form["CompanyKind"];
        string SematInCompany = context.Request.Form["SematInCompany"];
        string owner = context.Request.Form["owner"];

        string CountZemanatCheck = context.Request.Form["CountZemanatCheck"];
        string strZemanatInfoCheck = context.Request.Form["strZemanatInfoCheck"];
        string AyabZahab = context.Request.Form["AyabZahab"];
        string padashamalkard = context.Request.Form["padashamalkard"];

        string homesalary = context.Request.Form["homesalary"];
        string bonsalary = context.Request.Form["bonsalary"];
        string childsalary = context.Request.Form["childsalary"];
        string sanavat = context.Request.Form["sanavat"];
        string eydi = context.Request.Form["eydi"];
        string morakhasi = context.Request.Form["morakhasi"];

        string orgchart = context.Request.Form["orgchart"];
        string agent = context.Request.Form["agent"];

        string Marrid = context.Request.Form["Marrids"];

        string transporterkind = context.Request.Form["transporterkind"];
        string transportName = context.Request.Form["transportName"];
        string transportmodel = context.Request.Form["transportmodel"];
        string transportcolor = context.Request.Form["transportcolor"];
        string transportsharhbani = context.Request.Form["transportsharhbani"];
        string transportshasi = context.Request.Form["transportshasi"];
        string transportbadaneh = context.Request.Form["transportbadaneh"];

        string json = "";
        if (type == 2 && ReContract == 0) //new contract saati
        {
            var checkMelliCode = office.ofcPersonels.Where(c => c.strMelliCode.Trim() == mellicode.Trim()).FirstOrDefault();
            if (checkMelliCode == null)
            {
                try
                {
                    int personelCode = 0;
                    if (Convert.ToInt16(jensiat) == 1) // mard
                    {
                        personelCode = Convert.ToInt32(office.ofcPersonels.Where(c => c.numPersonelCode >= 3000).Max(c => c.numPersonelCode));
                        if (personelCode == null || personelCode == 0) personelCode = 3000;
                        else personelCode = personelCode + 1;
                    }
                    else //zan
                    {
                        personelCode = Convert.ToInt32(office.ofcPersonels.Where(c => c.numPersonelCode >= 1000 && c.numPersonelCode <= 2999).Max(c => c.numPersonelCode));
                        if (personelCode == null || personelCode == 0) personelCode = 1000;
                        else personelCode = personelCode + 1;
                    }

                    ofcPersonel ofcpersonel = new ofcPersonel();
                    ofcpersonel.numMarridRef = Convert.ToInt16(Marrid);
                    ofcpersonel.numStatus = 0;
                    ofcpersonel.strNumberShenasname = NumberShenasname;
                    ofcpersonel.strWorkCityRef = City;
                    ofcpersonel.strWorkProvinceRef = Province;
                    ofcpersonel.strExportCityRef = ExportCityRef;
                    ofcpersonel.strMelliCode = mellicode;
                    ofcpersonel.strPersonalPass = mellicode;
                    ofcpersonel.strPersonelAddress = PersonelAddress;
                    ofcpersonel.strPersonelFamily = family;
                    ofcpersonel.strPersonelName = name;
                    ofcpersonel.strFatherName = fatehrName;
                    ofcpersonel.strTel = tel;
                    ofcpersonel.strMobile = Mobile;
                    ofcpersonel.strRegisterUserRef = _ofcUser.strUserCode;
                    ofcpersonel.dateRegisterDate = _PDate.PersianDate;
                    ofcpersonel.timeRegisterTime = _PDate.PersianTime;
                    ofcpersonel.numEmployerRef = Convert.ToInt32(EmployerCode);
                    ofcpersonel.numJensiatRef = Convert.ToInt16(jensiat);
                    ofcpersonel.numPersonelCode = personelCode;
                    // ofcpersonel.numWorkGroupRef = 1; // default holding payegan bashe

                    ofcpersonel.strCompanyName = companyname;
                    ofcpersonel.strCompanyRegNumber = shomaresabt;
                    ofcpersonel.numCompanyType = Convert.ToInt16(CompanyKind);
                    ofcpersonel.numSematInCompany = Convert.ToInt16(SematInCompany);
                    ofcpersonel.numPerosnelCharacter = Convert.ToInt16(owner);

                    office.ofcPersonels.InsertOnSubmit(ofcpersonel);
                    //office.SubmitChanges();

                    //======================================================================================

                    ofcPersonelContract pContract = new ofcPersonelContract();

                    pContract.numPersonelRef = personelCode;
                    pContract.dateStartContractDate = dateContractFromDate;
                    pContract.dateEndContractDate = dateContractToDate;
                    pContract.dateRegisterContractDate = ContractDateTavafogh;
                    pContract.numContractKindRef = Convert.ToInt16(ContractKind);

                    pContract.numPersonelSalary = Convert.ToInt32(HoghogheSabet);
                    pContract.numPersonelBon = Convert.ToInt32(bonsalary);
                    pContract.numPersonelChildSalary = Convert.ToInt32(childsalary);
                    pContract.numPersonelHomeSalary = Convert.ToInt32(homesalary);
                    pContract.numPersonelPadash = Convert.ToInt32(padashamalkard);
                    pContract.numPersonelSaier = 0;
                    pContract.numPersonelSanavat = Convert.ToInt32(sanavat);
                    pContract.numPriceEidi = Convert.ToInt32(eydi);
                    pContract.numPriceLeave = Convert.ToInt32(morakhasi);
                    pContract.numPriceHaghModiriat = Convert.ToInt32(haghmodiriat);
                    pContract.numPriceAyabZahab = Convert.ToInt32(AyabZahab);

                    pContract.StrKarKardTime = karkardRozane;
                    pContract.strKhadamatDescription = khadamat;
                    pContract.numStatus = 1;
                    pContract.strContractMonth = ContractMonth;
                    pContract.strContractDay = ContractDay;
                    pContract.timeRegisterTime = _PDate.PersianTime;
                    pContract.strRegisterUserRef = _ofcUser.strUserCode;
                    pContract.dateRegisterDate = _PDate.PersianDate;
                    pContract.numEndOfKind = Convert.ToInt16(SaatiPriceEndKind);
                    pContract.strTitleFaraiand = TitlePadashContract.Trim();
                    pContract.dateCutWorkDate = dateContractToDate;
                    pContract.dateEstekhdamDate = _PDate.PersianDate;

                    pContract.numPriceJariEjareh = Convert.ToInt32(jariEjareh);
                    pContract.numPriceJariTel = Convert.ToInt32(jariTel);
                    pContract.numPriceJariNet = Convert.ToInt32(jariNet);
                    pContract.numPriceJariAbogaz = Convert.ToInt32(jariAbogaz);
                    pContract.numPricePorsantToziShode = Convert.ToInt32(PorsantToziShode);
                    pContract.numPricePorsantKharejMahdode = Convert.ToInt32(PorsantKharejMahdode);
                    pContract.numPricePorsantMoadeli = Convert.ToInt32(PorsantMoadeli);

                    pContract.numContractStateRef = Convert.ToInt32(Contractstate);
                    pContract.numAgentArea = Convert.ToInt32(AgantMetraj);
                    pContract.numAnbarArea = Convert.ToInt32(AnbarMetraj);
                    pContract.strZemanatType = zemanatkind;
                    pContract.numZemanatPrice = Convert.ToInt32(PriceZemanatNameh);
                    pContract.numCountZemanatSafteh = Convert.ToInt16(CountZemanatSafte);
                    pContract.strZemanatAllInfoSafteh = strZemanatInfo;

                    pContract.numCountZemanatCheck = Convert.ToInt16(CountZemanatCheck);
                    pContract.strZemanatAllInfoCheck = strZemanatInfoCheck;

                    office.ofcPersonelContracts.InsertOnSubmit(pContract);
                    office.SubmitChanges();
                    //======================================================================================
                    int numcode = pContract.numContractCode;
                    string uniqcontractCode = "";
                    string dateContractRegister = (_PDate.NowYear.Substring(2, _PDate.NowYear.Length - 2)) + "-" + _PDate.NowMonth + "-" + _PDate.NowDay;
                    if (numcode < 10) uniqcontractCode = dateContractRegister + "-0" + numcode.ToString();
                    else uniqcontractCode = dateContractRegister + "-" + numcode.ToString();
                    //======================================================================================
                    var contractCheck = office.ofcPersonelContracts.Where(c => c.numContractCode == numcode).FirstOrDefault();
                    if (contractCheck != null) contractCheck.StrContractUniqCode = uniqcontractCode;

                    //=======================================================================================
                    if (Contractstate == "2" && ContractKind == "3")
                    {
                        orgchart = orgchart.Replace("\"", "");
                        string[] orgchartArray = { "" };

                        if (orgchart != "-1")
                        {
                            orgchartArray = orgchart.Split(',').Where(c => !(String.IsNullOrEmpty(c))).ToArray();
                            orgchart = "";
                        }

                        foreach (var items in orgchartArray)
                        {
                            var qorgchart = office.ofcChartPositions.Where(c => c.numOrgChartRef == 43 && c.numOrgPositionRef == Convert.ToInt32(items)).FirstOrDefault();
                            if (qorgchart != null)
                            {
                                office.ofcPersonelChartPositions.InsertOnSubmit(new ofcPersonelChartPosition
                                {
                                    numPersonelRef = personelCode,
                                    numChartPositionRef = Convert.ToInt32(qorgchart.numChartPositionCode),
                                    numContractRef = numcode,
                                });
                            }
                        }
                        //======================================================================================

                        if (agent != "-1" && agent != "")
                        {
                            office.ofcPersonelAssignAgents.InsertOnSubmit(new ofcPersonelAssignAgent
                            {
                                numPersonelRef = personelCode,
                                numContractRef = numcode,
                                strPersonMelliRef = agent
                            });
                        }

                        if (transporterkind != "0")
                        {
                            office.ofcPersonelTransporterKinds.InsertOnSubmit(new ofcPersonelTransporterKind
                            {
                                numPersonelRef = personelCode,
                                numTransporterKind = Convert.ToByte(transporterkind),
                                strColor = transportcolor,
                                strModel = transportmodel,
                                strNumBody = transportbadaneh,
                                strNumShahrbani = transportsharhbani,
                                strNumShasi = transportshasi,
                                strOwnerName = transportName,
                                numContractRef = numcode
                            });
                        }
                    }

                    //======================================================================================

                    if (CompletePeikInfo == 1)
                    {
                        var checkPeik = office.ofcPrePersonels.Where(c => c.strMelliCode.Trim() == mellicode.Trim() && c.numStatus == 0).FirstOrDefault();
                        checkPeik.numStatus = 1;
                        checkPeik.numPersonelRef = personelCode;
                    }

                    office.SubmitChanges();

                    json = serializer.Serialize((object)"1^" + personelCode.ToString()); // sabt shod

                }
                catch (Exception ex)
                {
                    string a = ex.Message;
                    json = serializer.Serialize((object)"3"); // khata
                }

            }
            else
            {
                json = serializer.Serialize((object)"2"); //code melli tekrari
            }
        }
        else if (type == 2 && ReContract == 1) //new Recontract saati
        {
            var ofcpersonel = office.ofcPersonels.Where(c => c.numPersonelCode == PersonelCode).FirstOrDefault();
            if (ofcpersonel != null)
            {
                try
                {
                    ofcpersonel.numMarridRef = Convert.ToInt16(Marrid);
                    ofcpersonel.strWorkCityRef = City;
                    ofcpersonel.strWorkProvinceRef = Province;
                    ofcpersonel.numStatus = 0;
                    ofcpersonel.strNumberShenasname = NumberShenasname;
                    ofcpersonel.strExportCityRef = ExportCityRef;
                    ofcpersonel.strMelliCode = mellicode;
                    ofcpersonel.strPersonalPass = mellicode;
                    ofcpersonel.strPersonelAddress = PersonelAddress;
                    ofcpersonel.strPersonelFamily = family;
                    ofcpersonel.strPersonelName = name;
                    ofcpersonel.strFatherName = fatehrName;
                    ofcpersonel.strTel = tel;
                    ofcpersonel.strMobile = Mobile;
                    ofcpersonel.strRegisterUserRef = _ofcUser.strUserCode;
                    ofcpersonel.dateRegisterDate = _PDate.PersianDate;
                    ofcpersonel.timeRegisterTime = _PDate.PersianTime;
                    ofcpersonel.numEmployerRef = Convert.ToInt32(EmployerCode);
                    ofcpersonel.numJensiatRef = Convert.ToInt16(jensiat);

                    ofcpersonel.strCompanyName = companyname;
                    ofcpersonel.strCompanyRegNumber = shomaresabt;
                    ofcpersonel.numCompanyType = Convert.ToInt16(CompanyKind);
                    ofcpersonel.numSematInCompany = Convert.ToInt16(SematInCompany);
                    ofcpersonel.numPerosnelCharacter = Convert.ToInt16(owner);
                    //office.SubmitChanges();
                    //======================================================================================

                    var checkContractActive = office.ofcPersonelContracts.Where(c => c.numPersonelRef == PersonelCode && c.numStatus == 1).FirstOrDefault();
                    if (checkContractActive != null) checkContractActive.numStatus = 0; // ghire faal kardane gharardade feli


                    ofcPersonelContract pContract = new ofcPersonelContract();

                    //pContract.numWorkGroupRef = checkContractActive.numWorkGroupRef;

                    pContract.numPersonelRef = PersonelCode;
                    pContract.dateStartContractDate = dateContractFromDate;
                    pContract.dateEndContractDate = dateContractToDate;
                    pContract.dateRegisterContractDate = ContractDateTavafogh;
                    pContract.numContractKindRef = Convert.ToInt16(ContractKind);

                    pContract.numPersonelSalary = Convert.ToInt32(HoghogheSabet);
                    pContract.numPersonelBon = Convert.ToInt32(bonsalary);
                    pContract.numPersonelChildSalary = Convert.ToInt32(childsalary);
                    pContract.numPersonelHomeSalary = Convert.ToInt32(homesalary);
                    pContract.numPersonelPadash = Convert.ToInt32(padashamalkard);
                    pContract.numPersonelSaier = 0;
                    pContract.numPersonelSanavat = Convert.ToInt32(sanavat);
                    pContract.numPriceEidi = Convert.ToInt32(eydi);
                    pContract.numPriceLeave = Convert.ToInt32(morakhasi);
                    pContract.numPriceHaghModiriat = Convert.ToInt32(haghmodiriat);
                    pContract.numPriceAyabZahab = Convert.ToInt32(AyabZahab);

                    pContract.StrKarKardTime = karkardRozane;
                    pContract.strKhadamatDescription = khadamat;
                    pContract.numStatus = 1;
                    pContract.strContractMonth = ContractMonth;
                    pContract.strContractDay = ContractDay;
                    pContract.timeRegisterTime = _PDate.PersianTime;
                    pContract.strRegisterUserRef = _ofcUser.strUserCode;
                    pContract.dateRegisterDate = _PDate.PersianDate;
                    pContract.numEndOfKind = Convert.ToInt16(SaatiPriceEndKind);
                    pContract.strTitleFaraiand = TitlePadashContract.Trim();
                    pContract.dateCutWorkDate = dateContractToDate;
                    pContract.dateEstekhdamDate = _PDate.PersianDate;

                    pContract.numPriceJariEjareh = Convert.ToInt32(jariEjareh);
                    pContract.numPriceJariTel = Convert.ToInt32(jariTel);
                    pContract.numPriceJariNet = Convert.ToInt32(jariNet);
                    pContract.numPriceJariAbogaz = Convert.ToInt32(jariAbogaz);
                    pContract.numPricePorsantToziShode = Convert.ToInt32(PorsantToziShode);
                    pContract.numPricePorsantKharejMahdode = Convert.ToInt32(PorsantKharejMahdode);
                    pContract.numPricePorsantMoadeli = Convert.ToInt32(PorsantMoadeli);

                    pContract.numContractStateRef = Convert.ToInt32(Contractstate);
                    pContract.numAgentArea = Convert.ToInt32(AgantMetraj);
                    pContract.numAnbarArea = Convert.ToInt32(AnbarMetraj);
                    pContract.strZemanatType = zemanatkind;
                    pContract.numZemanatPrice = Convert.ToInt32(PriceZemanatNameh);
                    pContract.numCountZemanatSafteh = Convert.ToInt16(CountZemanatSafte);
                    pContract.strZemanatAllInfoSafteh = strZemanatInfo;

                    pContract.numCountZemanatCheck = Convert.ToInt16(CountZemanatCheck);
                    pContract.strZemanatAllInfoCheck = strZemanatInfoCheck;

                    office.ofcPersonelContracts.InsertOnSubmit(pContract);
                    office.SubmitChanges();
                    //======================================================================================
                    int numcode = pContract.numContractCode;
                    string uniqcontractCode = "";
                    string dateContractRegister = (_PDate.NowYear.Substring(2, _PDate.NowYear.Length - 2)) + "-" + _PDate.NowMonth + "-" + _PDate.NowDay;
                    if (numcode < 10) uniqcontractCode = dateContractRegister + "-0" + numcode.ToString();
                    else uniqcontractCode = dateContractRegister + "-" + numcode.ToString();
                    //======================================================================================
                    var contractCheck = office.ofcPersonelContracts.Where(c => c.numContractCode == numcode).FirstOrDefault();
                    if (contractCheck != null) contractCheck.StrContractUniqCode = uniqcontractCode;
                    //=======================================================================================
                    if (Contractstate == "2" && ContractKind == "3")
                    {
                        orgchart = orgchart.Replace("\"", "");
                        string[] orgchartArray = { "" };

                        if (orgchart != "-1")
                        {
                            orgchartArray = orgchart.Split(',').Where(c => !(String.IsNullOrEmpty(c))).ToArray();
                            orgchart = "";
                        }

                        foreach (var items in orgchartArray)
                        {
                            var qorgchart = office.ofcChartPositions.Where(c => c.numOrgChartRef == 43 && c.numOrgPositionRef == Convert.ToInt32(items)).FirstOrDefault();
                            if (qorgchart != null)
                            {
                                var checkpersonelchart = office.ofcPersonelChartPositions.Where(c => c.numPersonelRef == PersonelCode && c.numChartPositionRef == Convert.ToInt32(qorgchart.numChartPositionCode) && c.numContractRef == numcode).FirstOrDefault();
                                if (checkpersonelchart == null)
                                {
                                    office.ofcPersonelChartPositions.InsertOnSubmit(new ofcPersonelChartPosition
                                    {
                                        numPersonelRef = PersonelCode,
                                        numChartPositionRef = Convert.ToInt32(qorgchart.numChartPositionCode),
                                        numContractRef = numcode,
                                    });
                                }
                            }
                        }
                        //======================================================================================
                        if (agent != "-1" && agent != "")
                        {
                            office.ofcPersonelAssignAgents.InsertOnSubmit(new ofcPersonelAssignAgent
                            {
                                numPersonelRef = PersonelCode,
                                numContractRef = numcode,
                                strPersonMelliRef = agent
                            });
                        }

                        if (transporterkind != "0")
                        {
                            office.ofcPersonelTransporterKinds.InsertOnSubmit(new ofcPersonelTransporterKind
                            {
                                numPersonelRef = PersonelCode,
                                numTransporterKind = Convert.ToByte(transporterkind),
                                strColor = transportcolor,
                                strModel = transportmodel,
                                strNumBody = transportbadaneh,
                                strNumShahrbani = transportsharhbani,
                                strNumShasi = transportshasi,
                                strOwnerName = transportName,
                                numContractRef = numcode
                            });
                        }
                    }
                    //======================================================================================

                    office.SubmitChanges();

                    json = serializer.Serialize((object)"1"); // sabt shod

                }
                catch (Exception ex)
                {
                    string a = ex.Message;
                    json = serializer.Serialize((object)"3"); // khata
                }

            }
            else
            {
                json = serializer.Serialize((object)"2"); //yaft nashod
            }
        }
        else if (type == 4 || type == 5)
        {
            var ofcpersonel = office.ofcPersonels.Where(c => c.strMelliCode.Trim() == mellicode.Trim()).FirstOrDefault();
            if (ofcpersonel != null)
            {
                try
                {
                    ofcpersonel.numMarridRef = Convert.ToInt16(Marrid);
                    ofcpersonel.strWorkCityRef = City;
                    ofcpersonel.strWorkProvinceRef = Province;
                    ofcpersonel.strNumberShenasname = NumberShenasname;
                    ofcpersonel.strExportCityRef = ExportCityRef;
                    ofcpersonel.strMelliCode = mellicode;
                    ofcpersonel.strPersonalPass = mellicode;
                    ofcpersonel.strPersonelAddress = PersonelAddress;
                    ofcpersonel.strPersonelFamily = family;
                    ofcpersonel.strPersonelName = name;
                    ofcpersonel.strFatherName = fatehrName;
                    ofcpersonel.strTel = tel;
                    ofcpersonel.strMobile = Mobile;
                    ofcpersonel.strRegisterUserRef = _ofcUser.strUserCode;
                    ofcpersonel.dateRegisterDate = _PDate.PersianDate;
                    ofcpersonel.timeRegisterTime = _PDate.PersianTime;
                    ofcpersonel.numEmployerRef = Convert.ToInt32(EmployerCode);
                    ofcpersonel.numJensiatRef = Convert.ToInt16(jensiat);

                    ofcpersonel.strCompanyName = companyname;
                    ofcpersonel.strCompanyRegNumber = shomaresabt;
                    ofcpersonel.numCompanyType = Convert.ToInt16(CompanyKind);
                    ofcpersonel.numSematInCompany = Convert.ToInt16(SematInCompany);
                    ofcpersonel.numPerosnelCharacter = Convert.ToInt16(owner);

                    //office.SubmitChanges();

                    //======================================================================================
                    var pContract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == ofcpersonel.numPersonelCode && c.numContractCode == contractcode && c.numStatus == 1).FirstOrDefault();
                    if (pContract != null)
                    {
                        pContract.dateStartContractDate = dateContractFromDate;
                        pContract.dateEndContractDate = dateContractToDate;
                        pContract.dateRegisterContractDate = ContractDateTavafogh;
                        pContract.numContractKindRef = Convert.ToInt16(ContractKind);

                        pContract.numPersonelSalary = Convert.ToInt32(HoghogheSabet);
                        pContract.numPersonelBon = Convert.ToInt32(bonsalary);
                        pContract.numPersonelChildSalary = Convert.ToInt32(childsalary);
                        pContract.numPersonelHomeSalary = Convert.ToInt32(homesalary);
                        pContract.numPersonelPadash = Convert.ToInt32(padashamalkard);
                        pContract.numPersonelSaier = 0;
                        pContract.numPersonelSanavat = Convert.ToInt32(sanavat);
                        pContract.numPriceEidi = Convert.ToInt32(eydi);
                        pContract.numPriceLeave = Convert.ToInt32(morakhasi);
                        pContract.numPriceHaghModiriat = Convert.ToInt32(haghmodiriat);
                        pContract.numPriceAyabZahab = Convert.ToInt32(AyabZahab);


                        pContract.StrKarKardTime = karkardRozane;
                        pContract.strKhadamatDescription = khadamat;
                        pContract.numStatus = 1;
                        pContract.strContractMonth = ContractMonth;
                        pContract.strContractDay = ContractDay;
                        pContract.timeRegisterTime = _PDate.PersianTime;
                        pContract.strRegisterUserRef = _ofcUser.strUserCode;
                        pContract.dateRegisterDate = _PDate.PersianDate;
                        pContract.numEndOfKind = Convert.ToInt16(SaatiPriceEndKind);
                        pContract.strTitleFaraiand = TitlePadashContract.Trim();
                        pContract.dateCutWorkDate = dateContractToDate;
                        pContract.dateEstekhdamDate = _PDate.PersianDate;


                        pContract.numPriceJariEjareh = Convert.ToInt32(jariEjareh);
                        pContract.numPriceJariTel = Convert.ToInt32(jariTel);
                        pContract.numPriceJariNet = Convert.ToInt32(jariNet);
                        pContract.numPriceJariAbogaz = Convert.ToInt32(jariAbogaz);
                        pContract.numPricePorsantToziShode = Convert.ToInt32(PorsantToziShode);
                        pContract.numPricePorsantKharejMahdode = Convert.ToInt32(PorsantKharejMahdode);
                        pContract.numPricePorsantMoadeli = Convert.ToInt32(PorsantMoadeli);

                        pContract.numContractStateRef = Convert.ToInt32(Contractstate);
                        pContract.numAgentArea = Convert.ToInt32(AgantMetraj);
                        pContract.numAnbarArea = Convert.ToInt32(AnbarMetraj);
                        pContract.strZemanatType = zemanatkind;
                        pContract.numZemanatPrice = Convert.ToInt32(PriceZemanatNameh);
                        pContract.numCountZemanatSafteh = Convert.ToInt16(CountZemanatSafte);
                        pContract.strZemanatAllInfoSafteh = strZemanatInfo;

                        pContract.numCountZemanatCheck = Convert.ToInt16(CountZemanatCheck);
                        pContract.strZemanatAllInfoCheck = strZemanatInfoCheck;


                        //=======================================================================================
                        if (ContractKind == "3")
                        {
                            orgchart = orgchart.Replace("\"", "");
                            string[] orgchartArray = { "" };

                            if (orgchart != "-1")
                            {
                                orgchartArray = orgchart.Split(',').Where(c => !(String.IsNullOrEmpty(c))).ToArray();
                                orgchart = "";
                            }

                            var checkpersonelchart1 = office.ofcPersonelChartPositions.Where(c => c.numPersonelRef == ofcpersonel.numPersonelCode && c.numContractRef == pContract.numContractCode);
                            if (checkpersonelchart1.Any())
                            {
                                office.ofcPersonelChartPositions.DeleteAllOnSubmit(checkpersonelchart1);
                                try { office.SubmitChanges(); } catch { }
                            }

                            foreach (var items in orgchartArray)
                            {
                                var qorgchart = office.ofcChartPositions.Where(c => c.numOrgChartRef == 43 && c.numOrgPositionRef == Convert.ToInt32(items)).FirstOrDefault();
                                if (qorgchart != null)
                                {
                                    var checkpersonelchart = office.ofcPersonelChartPositions.Where(c => c.numPersonelRef == ofcpersonel.numPersonelCode && c.numChartPositionRef == Convert.ToInt32(qorgchart.numChartPositionCode) && c.numContractRef == pContract.numContractCode).FirstOrDefault();
                                    if (checkpersonelchart == null)
                                    {
                                        office.ofcPersonelChartPositions.InsertOnSubmit(new ofcPersonelChartPosition
                                        {
                                            numPersonelRef = ofcpersonel.numPersonelCode,
                                            numChartPositionRef = Convert.ToInt32(qorgchart.numChartPositionCode),
                                            numContractRef = pContract.numContractCode,
                                        });
                                    }
                                }
                            }

                            //==============================================================================
                            var checkAssignAgent = office.ofcPersonelAssignAgents.Where(c => c.numPersonelRef == ofcpersonel.numPersonelCode && c.numContractRef == pContract.numContractCode);
                            if (checkAssignAgent.Any())
                            {
                                office.ofcPersonelAssignAgents.DeleteAllOnSubmit(checkAssignAgent);
                                try { office.SubmitChanges(); } catch { }
                            }
                            if (agent != "-1" && agent != "")
                            {
                                office.ofcPersonelAssignAgents.InsertOnSubmit(new ofcPersonelAssignAgent
                                {
                                    numPersonelRef = ofcpersonel.numPersonelCode,
                                    numContractRef = pContract.numContractCode,
                                    strPersonMelliRef = agent
                                });
                            }


                            //======================================================================================
                            var checkTransporterKind = office.ofcPersonelTransporterKinds.Where(c => c.numPersonelRef == ofcpersonel.numPersonelCode && c.numContractRef == pContract.numContractCode);
                            if (checkTransporterKind.Any())
                            {
                                office.ofcPersonelTransporterKinds.DeleteAllOnSubmit(checkTransporterKind);
                                try { office.SubmitChanges(); } catch { }
                            }
                            if (transporterkind != "0")
                            {
                                office.ofcPersonelTransporterKinds.InsertOnSubmit(new ofcPersonelTransporterKind
                                {
                                    numPersonelRef = ofcpersonel.numPersonelCode,
                                    numTransporterKind = Convert.ToByte(transporterkind),
                                    strColor = transportcolor,
                                    strModel = transportmodel,
                                    strNumBody = transportbadaneh,
                                    strNumShahrbani = transportsharhbani,
                                    strNumShasi = transportshasi,
                                    strOwnerName = transportName,
                                    numContractRef = pContract.numContractCode,
                                });
                            }
                        }
                        //======================================================================================

                    }
                    office.SubmitChanges();

                    json = serializer.Serialize((object)"6"); //edit ok
                }
                catch (Exception ex)
                {
                    string a = ex.Message;
                    json = serializer.Serialize((object)"5"); //khata edit
                }

            }
            else
            {
                json = serializer.Serialize((object)"4"); //yaft nashod
            }
        }

        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //-------------------------حذف اطلاعات کارمند-------------------------
    //---------------------------------------------------------------------
    public void DeletePersonel()
    {
        string mellicode = context.Request.Form["mellicode"];
        int contractcode = Convert.ToInt32(context.Request.Form["contractcode"]);

        string json = "";
        int contractstate = 0;
        var checkMelliCode = office.ofcPersonels.Where(c => c.strMelliCode.Trim() == mellicode.Trim()).FirstOrDefault();
        if (checkMelliCode != null)
        {
            try
            {
                int checkContract2 = office.ofcPersonelContracts.Where(c => c.numPersonelRef == checkMelliCode.numPersonelCode).Count();
                if (checkContract2 == 1)
                {
                    office.ofcPersonels.DeleteOnSubmit(checkMelliCode);
                    var checkReagent = office.ofcPersonelReagents.Where(c => c.numPersonelRef == checkMelliCode.numPersonelCode).FirstOrDefault();
                    if (checkReagent != null) office.ofcPersonelReagents.DeleteOnSubmit(checkReagent);
                }
                var checkContract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == checkMelliCode.numPersonelCode && c.numContractCode == contractcode).FirstOrDefault();
                if (checkContract != null) office.ofcPersonelContracts.DeleteOnSubmit(checkContract);

                //=========================================return end contract=============================================
                var EndContract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == checkMelliCode.numPersonelCode && c.numContractCode != contractcode).OrderByDescending(c => c.numContractCode).FirstOrDefault();
                if (EndContract != null)
                {
                    var checkEndPrice = office.ofcPersonelPreInvoices.Where(c => c.numContractRef == EndContract.numContractCode).OrderByDescending(c => c.numInvoiceCode).FirstOrDefault();
                    if (checkEndPrice == null)
                    {
                        var checksaatiEndPrice = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numContractRef == EndContract.numContractCode).OrderByDescending(c => c.numInvoiceSaatiCode).FirstOrDefault();
                        if (checksaatiEndPrice != null)
                        {
                            contractstate = checksaatiEndPrice.numStatus == 2 ? 1 : 0; // ghate hamkari bod 1
                        }
                    }
                    else
                    {
                        contractstate = checkEndPrice.numStatus == 2 ? 1 : 0;// ghate hamkari bod 1
                    }
                    //-------------------------------------------------------
                    if (contractstate == 1)
                    {
                        checkMelliCode.numStatus = 3;
                    }
                    else
                    {
                        EndContract.numStatus = 1;

                        if (checkMelliCode.numBlodRef == null) checkMelliCode.numStatus = 1;
                        else checkMelliCode.numStatus = 2;
                    }
                }

                //======================================================================================

                var checkpersonelchart1 = office.ofcPersonelChartPositions.Where(c => c.numPersonelRef == checkMelliCode.numPersonelCode && c.numContractRef == contractcode);
                if (checkpersonelchart1.Any())
                {
                    office.ofcPersonelChartPositions.DeleteAllOnSubmit(checkpersonelchart1);
                    // try { office.SubmitChanges(); } catch { }
                }


                var checkAssignAgent = office.ofcPersonelAssignAgents.Where(c => c.numPersonelRef == checkMelliCode.numPersonelCode && c.numContractRef == contractcode);
                if (checkAssignAgent.Any())
                {
                    office.ofcPersonelAssignAgents.DeleteAllOnSubmit(checkAssignAgent);
                    //try { office.SubmitChanges(); } catch { }
                }


                //======================================================================================
                var checkPre = office.ofcPrePersonels.Where(c => c.numPersonelRef == checkMelliCode.numPersonelCode && c.numStatus == 1).FirstOrDefault();
                if (checkPre != null)
                {
                    checkPre.numStatus = 0;
                    checkPre.numPersonelRef = null;
                }
                //======================================================================================
                var checkTransporterKind = office.ofcPersonelTransporterKinds.Where(c => c.numPersonelRef == checkMelliCode.numPersonelCode && c.numContractRef == contractcode);
                if (checkTransporterKind.Any())
                {
                    office.ofcPersonelTransporterKinds.DeleteAllOnSubmit(checkTransporterKind);
                    //  try { office.SubmitChanges(); } catch { }
                }

                //======================================================================================
                office.SubmitChanges();
                json = serializer.Serialize((object)"1"); // hazf shod
            }
            catch (Exception ex)
            {
                string msg = ex.Message;
                json = serializer.Serialize((object)"3"); // khata
            }

        }
        else
        {
            json = serializer.Serialize((object)"2"); //code melli tekrari
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //-------------------------ویرایش اطلاعات کارمند-------------------------
    //---------------------------------------------------------------------
    public void EditPersonel()
    {
        string mellicode = context.Request.Form["mellicode"];
        string contractCode = context.Request.Form["contractCode"];
        string type = context.Request.Form["type"];
        int contractcode = 0;

        string json = "";

        string agentcode = "-1";
        int numpersonelcode = 0;

        var contract22 = (from t in office.ofcPersonelContracts
                          join t1 in office.ofcPersonels on t.numPersonelRef equals t1.numPersonelCode
                          where
                          t1.strMelliCode.Trim() == mellicode.Trim()
                          &&
                          t.numStatus == 1
                          select t).ToList();
        if (contract22.Any())
        {
            contractcode = contract22.FirstOrDefault().numContractCode;
            numpersonelcode = Convert.ToInt32(contract22.FirstOrDefault().numPersonelRef);

            var agentq = (from t in office.ofcPersonelAssignAgents
                          where
                            (t.numPersonelRef == numpersonelcode && t.numContractRef == contractcode)
                          select new
                          {
                              t.strPersonMelliRef,
                          }).FirstOrDefault();

            if (agentq != null)
                agentcode = agentq.strPersonMelliRef.Trim();
        }

        var checkMelliCode = (from t in office.ofcPersonels
                              where t.strMelliCode.Trim() == mellicode.Trim()
                              &&
                              ((type == "1" && t.numStatus == 0) || type == "2")
                              select new
                              {
                                  t.numMarridRef,
                                  t.strNumberShenasname,
                                  t.strWorkCityRef,
                                  t.strWorkProvinceRef,
                                  t.strExportCityRef,
                                  t.strFatherName,
                                  t.strMelliCode,
                                  t.strPersonalPass,
                                  t.strPersonelAddress,
                                  t.strPersonelFamily,
                                  t.strPersonelName,
                                  t.strPostCode,
                                  strMobile = t.strMobile == null ? "0" : t.strMobile,
                                  strTel = t.strTel == null ? "0-0" : t.strTel,
                                  t.dateBrithdayDate,
                                  t.numEmployerRef,
                                  t.numJensiatRef,
                                  t.numPersonelCode,

                                  t.numPerosnelCharacter,
                                  t.strCompanyName,
                                  t.strCompanyRegNumber,
                                  t.numCompanyType,
                                  t.numSematInCompany,
                                  agentcode
                              }).ToList();
        if (checkMelliCode.Count() > 0)
        {
            string chartposition = "-1";
            numpersonelcode = Convert.ToInt32(checkMelliCode.FirstOrDefault().numPersonelCode);
            var contract2 = (from t in office.ofcPersonelContracts
                             join t1 in office.ofcPersonelTransporterKinds on t.numContractCode equals t1.numContractRef into _joint1
                             from t1 in _joint1.DefaultIfEmpty()
                             where
                             t.numPersonelRef == numpersonelcode
                             &&
                             ((type == "1" && t.numStatus == 1) || (type == "2" && t.numContractCode == Convert.ToInt32(contractCode)))
                             select new { t, t1 }).ToList();

            contractcode = contract2.FirstOrDefault().t.numContractCode;

            var chartq = (from t in office.ofcPersonelChartPositions
                          join t1 in office.ofcChartPositions on t.numChartPositionRef equals t1.numChartPositionCode
                          where
                            (t.numPersonelRef == numpersonelcode && t.numContractRef == contractcode)
                          select new
                          {
                              t1.numOrgChartRef,
                              t1.numOrgPositionRef
                          });

            if (chartq.Any())
            {
                chartposition = "";
                foreach (var item in chartq)
                {
                    if (item.numOrgPositionRef != null)
                    {
                        chartposition = chartposition + item.numOrgPositionRef + ",";
                    }
                }
            }


            var contract = (from d in contract2
                            select new
                            {
                                numContractCode = d.t.numContractCode,
                                dateStartContractDate = d.t.dateStartContractDate,
                                dateEndContractDate = d.t.dateEndContractDate,
                                dateUnvalidContractDate = d.t.dateUnvalidContractDate,
                                numContractKindRef = d.t.numContractKindRef,
                                numPersonelBon = d.t.numPersonelBon,
                                numPersonelChildSalary = d.t.numPersonelChildSalary,
                                numPersonelHomeSalary = d.t.numPersonelHomeSalary,
                                numPersonelRef = d.t.numPersonelRef,
                                numPersonelSalary = d.t.numPersonelSalary,
                                dateDoreFromDate = d.t.dateDoreFromDate,
                                dateDoreToDate = d.t.dateDoreToDate,
                                numPersonelPadash = d.t.numPersonelPadash,
                                numPersonelSaier = d.t.numPersonelSaier,
                                numPersonelSanavat = d.t.numPersonelSanavat,
                                strContractMonth = d.t.strContractMonth,
                                strContractDay = d.t.strContractDay,
                                dateRegisterContractDate = d.t.dateRegisterContractDate,
                                numEndOfKind = d.t.numEndOfKind,
                                StrKarKardTime = d.t.StrKarKardTime,
                                strTitleFaraiand = d.t.strTitleFaraiand,
                                strKhadamatDescription = d.t.strKhadamatDescription,

                                numPriceHaghModiriat = d.t.numPriceHaghModiriat == null ? 0 : d.t.numPriceHaghModiriat,
                                numPriceJariAbogaz = d.t.numPriceJariAbogaz == null ? 0 : d.t.numPriceJariAbogaz,
                                numPriceJariEjareh = d.t.numPriceJariEjareh == null ? 0 : d.t.numPriceJariEjareh,
                                numPriceJariNet = d.t.numPriceJariNet == null ? 0 : d.t.numPriceJariNet,
                                numPriceJariTel = d.t.numPriceJariTel == null ? 0 : d.t.numPriceJariTel,
                                numPricePorsantToziShode = d.t.numPricePorsantToziShode == null ? 0 : d.t.numPricePorsantToziShode,
                                numPricePorsantKharejMahdode = d.t.numPricePorsantKharejMahdode == null ? 0 : d.t.numPricePorsantKharejMahdode,
                                numPricePorsantMoadeli = d.t.numPricePorsantMoadeli == null ? 0 : d.t.numPricePorsantMoadeli,

                                numPriceAyabZahab = d.t.numPriceAyabZahab == null ? 0 : d.t.numPriceAyabZahab,

                                numPriceEidi = d.t.numPriceEidi == null ? 0 : d.t.numPriceEidi,
                                numPriceLeave = d.t.numPriceLeave == null ? 0 : d.t.numPriceLeave,

                                numContractStateRef = d.t.numContractStateRef == null ? 1 : d.t.numContractStateRef,
                                numAgentArea = d.t.numAgentArea == null ? 0 : d.t.numAgentArea,
                                numAnbarArea = d.t.numAnbarArea == null ? 0 : d.t.numAnbarArea,
                                numZemanatPrice = d.t.numZemanatPrice == null ? 0 : d.t.numZemanatPrice,
                                numCountZemanatSafteh = d.t.numCountZemanatSafteh == null ? 0 : d.t.numCountZemanatSafteh,
                                numCountZemanatCheck = d.t.numCountZemanatCheck == null ? 0 : d.t.numCountZemanatCheck,

                                strZemanatType = d.t.strZemanatType == null ? "" : d.t.strZemanatType,
                                strZemanatAllInfoSafteh = d.t.strZemanatAllInfoSafteh == null ? "" : d.t.strZemanatAllInfoSafteh,
                                strZemanatAllInfoCheck = d.t.strZemanatAllInfoCheck == null ? "" : d.t.strZemanatAllInfoCheck,

                                numTransporterKind = d.t1 == null || d.t1.numTransporterKind == null ? 0 : d.t1.numTransporterKind,
                                strNumBody = d.t1 == null || d.t1.strNumBody == null ? "" : d.t1.strNumBody,
                                strColor = d.t1 == null || d.t1.strColor == null ? "" : d.t1.strColor,
                                strModel = d.t1 == null || d.t1.strModel == null ? "" : d.t1.strModel,
                                strNumShahrbani = d.t1 == null || d.t1.strNumShahrbani == null ? "" : d.t1.strNumShahrbani,
                                strNumShasi = d.t1 == null || d.t1.strNumShasi == null ? "" : d.t1.strNumShasi,
                                strOwnerName = d.t1 == null || d.t1.strOwnerName == null ? "" : d.t1.strOwnerName,

                                chartposition
                            }).ToList();


            var moaref = (from t in office.ofcPersonelReagents
                          where t.numPersonelRef == numpersonelcode
                          select new
                          {
                              t.numPersonelRef,
                              t.strReagentAddress,
                              t.strReagentFamily,
                              t.strReagentMobile,
                              t.strReagentName,
                              t.strReagentRelation,
                              t.strReagentTel
                          }).ToList();

            string json1 = serializer.Serialize((object)checkMelliCode);
            string json2 = serializer.Serialize((object)contract);
            string json3 = serializer.Serialize((object)moaref);
            json = "[" + json1 + "," + json2 + "," + json3 + "]";
        }
        else
        {
            json = serializer.Serialize((object)"2");
        }


        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------ثبت نهایی قرارداد-----------------------
    //---------------------------------------------------------------------
    public void saveContractFinal()
    {
        string melliCode = context.Request.Form["melliCode"];
        string json = "";
        var personelCode = office.ofcPersonels.Where(c => c.strMelliCode.Trim() == melliCode.Trim() && c.numStatus == 0).FirstOrDefault();
        if (personelCode != null)
        {
            try
            {
                int checkContract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == personelCode.numPersonelCode).Count();

                if (personelCode.numBlodRef == null)
                    personelCode.numStatus = 1;
                else
                    personelCode.numStatus = 2;

                office.SubmitChanges();
                if (checkContract > 1)
                {
                    json = serializer.Serialize((object)"2"); // hamkari mojadad shod
                }
                else
                {


                    json = serializer.Serialize((object)"1^" + personelCode.numPersonelCode.ToString()); // sabt shod
                }
            }
            catch
            {
                json = serializer.Serialize((object)"4"); // khata
            }

        }
        else
        {
            json = serializer.Serialize((object)"3");
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    private void GetInfoPersonelForReContract()
    {
        string json = "";
        if (_ofcUser.numRoleRef != 5)
        {
            string personelcode = context.Request.Form["personelcode"];
            string melicode = context.Request.Form["melicode"];

            personelcode = personelcode == "" ? "-1" : personelcode;
            melicode = melicode == "" ? "-1" : melicode;

            var contractCheck = (from t in office.ofcPersonelContracts
                                 join t1 in office.ofcPersonels on t.numPersonelRef equals t1.numPersonelCode
                                 where (t1.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                                       &&
                                       (t1.strMelliCode == melicode || melicode == "-1")
                                 orderby t.numContractCode descending
                                 select new
                                 {
                                     t.dateEndContractDate,
                                     t1.numStatus
                                 }).FirstOrDefault();
            if (contractCheck != null)
            {
                int flag = 0;
                if (string.Compare(_PDate.PersianDate, contractCheck.dateEndContractDate) > 0) flag = 1;
                if (contractCheck.numStatus == 3) flag = 1;
                int contractcode = 0;
                if (flag == 1)
                {
                    string agentcode = "-1";

                    var contract22 = (from t in office.ofcPersonelContracts
                                      where
                                      t.numPersonelRef == Convert.ToInt32(personelcode)
                                      //&&
                                      //t.numStatus == 1
                                      select t).OrderByDescending(c => c.numContractCode).Take(1).ToList();
                    if (contract22.Any())
                    {
                        contractcode = contract22.FirstOrDefault().numContractCode;

                        var agentq = (from t in office.ofcPersonelAssignAgents
                                      where
                                        (t.numPersonelRef == Convert.ToInt32(personelcode) && t.numContractRef == contractcode)
                                      select new
                                      {
                                          t.strPersonMelliRef,
                                      }).FirstOrDefault();

                        if (agentq != null)
                            agentcode = agentq.strPersonMelliRef.Trim();
                    }

                    var checkpersonelcode = (from t in office.ofcPersonels
                                             where
                                             (t.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                                             &&
                                             (t.strMelliCode == melicode || melicode == "-1")

                                             select new
                                             {
                                                 t.numMarridRef,
                                                 t.strNumberShenasname,
                                                 t.strWorkCityRef,
                                                 t.strWorkProvinceRef,
                                                 t.strExportCityRef,
                                                 t.strFatherName,
                                                 t.strMelliCode,
                                                 t.strPersonalPass,
                                                 t.strPersonelAddress,
                                                 t.strPersonelFamily,
                                                 t.strPersonelName,
                                                 t.strPostCode,
                                                 strMobile = t.strMobile == null ? "0" : t.strMobile,
                                                 strTel = t.strTel == null ? "0-0" : t.strTel,
                                                 t.dateBrithdayDate,
                                                 t.numEmployerRef,
                                                 t.numJensiatRef,
                                                 t.numPersonelCode,

                                                 t.numPerosnelCharacter,
                                                 t.strCompanyName,
                                                 t.strCompanyRegNumber,
                                                 t.numCompanyType,
                                                 t.numSematInCompany,
                                                 agentcode
                                             }).ToList();
                    if (checkpersonelcode.Count() > 0)
                    {
                        string chartposition = "-1";

                        var contract2 = (from t in office.ofcPersonelContracts
                                         where
                                         t.numPersonelRef == Convert.ToInt32(personelcode)
                                         //&&
                                         //t.numStatus == 1
                                         select t).OrderByDescending(c => c.numContractCode).Take(1).ToList();
                        if (contract2.Any())
                        {
                            contractcode = contract2.FirstOrDefault().numContractCode;

                            var chartq = (from t in office.ofcPersonelChartPositions
                                          join t1 in office.ofcChartPositions on t.numChartPositionRef equals t1.numChartPositionCode
                                          where
                                            (t.numPersonelRef == Convert.ToInt32(personelcode) && t.numContractRef == contractcode)
                                          select new
                                          {
                                              t1.numOrgChartRef,
                                              t1.numOrgPositionRef
                                          });

                            if (chartq.Any())
                            {
                                chartposition = "";
                                foreach (var item in chartq)
                                {
                                    if (item.numOrgPositionRef != null)
                                    {
                                        chartposition = chartposition + item.numOrgPositionRef + ",";
                                    }
                                }
                            }

                            var contract = (from t in office.ofcPersonelContracts
                                            join t1 in office.ofcPersonels on t.numPersonelRef equals t1.numPersonelCode
                                            join t2 in office.ofcPersonelTransporterKinds on t.numContractCode equals t2.numContractRef into _joint1
                                            from t2 in _joint1.DefaultIfEmpty()
                                            where
                                               (t1.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                                               &&
                                               (t1.strMelliCode == melicode || melicode == "-1")
                                               &&
                                               t.numStatus == 1
                                            orderby t.numContractCode descending
                                            select new
                                            {
                                                numPersonelChildSalary = t.numPersonelChildSalary,
                                                numPersonelPadash = t.numPersonelPadash,
                                                numPersonelSalary = t.numPersonelSalary,
                                                numPersonelSaier = t.numPersonelSaier,
                                                numPersonelBon = t.numPersonelBon,
                                                numPersonelHomeSalary = t.numPersonelHomeSalary,
                                                numPersonelSanavat = t.numPersonelSanavat,
                                                numPriceEidi = t.numPriceEidi == null ? 0 : t.numPriceEidi,
                                                numPriceLeave = t.numPriceLeave == null ? 0 : t.numPriceLeave,
                                                strTitleFaraiand = t.strTitleFaraiand,
                                                numEndOfKind = t.numEndOfKind,
                                                numContractKindRef = t.numContractKindRef,
                                                numPriceHaghModiriat = t.numPriceHaghModiriat == null ? 0 : t.numPriceHaghModiriat,
                                                numPriceJariAbogaz = t.numPriceJariAbogaz == null ? 0 : t.numPriceJariAbogaz,
                                                numPriceJariEjareh = t.numPriceJariEjareh == null ? 0 : t.numPriceJariEjareh,
                                                numPriceJariNet = t.numPriceJariNet == null ? 0 : t.numPriceJariNet,
                                                numPriceJariTel = t.numPriceJariTel == null ? 0 : t.numPriceJariTel,
                                                numPricePorsantToziShode = t.numPricePorsantToziShode == null ? 0 : t.numPricePorsantToziShode,
                                                numPricePorsantKharejMahdode = t.numPricePorsantKharejMahdode == null ? 0 : t.numPricePorsantKharejMahdode,
                                                numPricePorsantMoadeli = t.numPricePorsantMoadeli == null ? 0 : t.numPricePorsantMoadeli,

                                                numPriceAyabZahab = t.numPriceAyabZahab == null ? 0 : t.numPriceAyabZahab,
                                                numContractStateRef = t.numContractStateRef == null ? 1 : t.numContractStateRef,
                                                numAgentArea = t.numAgentArea == null ? 0 : t.numAgentArea,
                                                numAnbarArea = t.numAnbarArea == null ? 0 : t.numAnbarArea,
                                                numZemanatPrice = t.numZemanatPrice == null ? 0 : t.numZemanatPrice,
                                                numCountZemanatSafteh = t.numCountZemanatSafteh == null ? 0 : t.numCountZemanatSafteh,
                                                numCountZemanatCheck = t.numCountZemanatCheck == null ? 0 : t.numCountZemanatCheck,

                                                strZemanatType = t.strZemanatType == null ? "" : t.strZemanatType,
                                                strZemanatAllInfoSafteh = t.strZemanatAllInfoSafteh == null ? "" : t.strZemanatAllInfoSafteh,
                                                strZemanatAllInfoCheck = t.strZemanatAllInfoCheck == null ? "" : t.strZemanatAllInfoCheck,

                                                numTransporterKind = t2 == null || t2.numTransporterKind == null ? 0 : t2.numTransporterKind,
                                                strNumBody = t2 == null || t2.strNumBody == null ? "" : t2.strNumBody,
                                                strColor = t2 == null || t2.strColor == null ? "" : t2.strColor,
                                                strModel = t2 == null || t2.strModel == null ? "" : t2.strModel,
                                                strNumShahrbani = t2 == null || t2.strNumShahrbani == null ? "" : t2.strNumShahrbani,
                                                strNumShasi = t2 == null || t2.strNumShasi == null ? "" : t2.strNumShasi,
                                                strOwnerName = t2 == null || t2.strOwnerName == null ? "" : t2.strOwnerName,

                                                chartposition
                                            });

                            var moaref = (from t in office.ofcPersonelReagents
                                          join t1 in office.ofcPersonels on t.numPersonelRef equals t1.numPersonelCode
                                          where (t1.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                                                &&
                                                 (t1.strMelliCode == melicode || melicode == "-1")
                                          select new
                                          {
                                              t.numPersonelRef,
                                              t.strReagentAddress,
                                              t.strReagentFamily,
                                              t.strReagentMobile,
                                              t.strReagentName,
                                              t.strReagentRelation,
                                              t.strReagentTel
                                          }).ToList();

                            string json1 = serializer.Serialize((object)checkpersonelcode);
                            string json2 = serializer.Serialize((object)moaref);
                            string json3 = serializer.Serialize((object)contract.ToList());
                            json = "[" + json1 + "," + json2 + "," + json3 + "]";
                        }
                        else
                        {
                            json = serializer.Serialize((object)"2");

                        }
                    }
                    else
                    {
                        json = serializer.Serialize((object)"2");
                    }
                }
                else
                {
                    json = serializer.Serialize((object)"3");
                }
            }
            else
            {
                json = serializer.Serialize((object)"5");

            }
        }
        else
        {
            json = serializer.Serialize((object)"5");

        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //-----دریافت اطلاعات پرسنلی که تاریخ پایان قرارداداشان سر رسیده----
    //---------------------------------------------------------------------
    private void GetInfoPersonelEndContract()
    {
        string json = "";
        if (_ofcUser.numRoleRef != 5)
        {
            string personelcode = context.Request.Form["personelcode"];
            string melicode = context.Request.Form["mellicode"];
            string contractkind = context.Request.Form["contractkind"];
            string grohkari = context.Request.Form["grohkari"].Replace("\"", "");

            personelcode = personelcode == "" ? "-1" : personelcode;
            melicode = melicode == "" ? "-1" : melicode;
            contractkind = contractkind == "" ? "-1" : contractkind;
            grohkari = grohkari == "" ? "-1" : grohkari;
            PersianDateTime _pdate = new PersianDateTime(0);

            string[] grohkariRoomArray = { "" };

            if (grohkari != "-1")
            {
                grohkariRoomArray = grohkari.Split(',');
                grohkari = "";
            }

            var q = from t in office.ofcPersonels
                    join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                    join t2 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t2.numWorkGroupCode
                    where
                        (t.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                        &&
                        (t.strMelliCode == melicode || melicode == "-1")
                        &&
                        (t.numStatus == 1 || t.numStatus == 2)
                        &&
                        t1.numStatus == 1
                        &&
                        string.Compare(t1.dateEndContractDate, _pdate.PersianDate) <= 0
                        &&
                        (t1.numContractKindRef == Convert.ToInt32(contractkind) || contractkind == "-1")
                        &&
                        (grohkariRoomArray.Contains(t1.numWorkGroupRef.ToString()) || grohkari == "-1")
                    orderby t.numPersonelCode
                    select new
                    {
                        t.numPersonelCode,
                        strPersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                        t2.strWorkGroupName,
                        t1.dateEndContractDate,
                        contractkindname = t1.numContractKindRef == 1 ? "موقت" : t1.numContractKindRef == 2 ? "ساعتی" : t1.numContractKindRef == 3 ? "پیمانکاری" : "",
                        t1.numContractKindRef
                    };

            json = serializer.Serialize((object)q);
        }
        else
        {
            json = serializer.Serialize((object)"");

        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //-----دریافت تعداد پرسنلی که تاریخ پایان قرارداداشان سر رسیده----
    //---------------------------------------------------------------------
    private void GetCountPersonelEndContract()
    {
        PersianDateTime _pdate = new PersianDateTime(0);
        int cnt = (from t in office.ofcPersonels
                   join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                   where
                       (t.numStatus == 1 || t.numStatus == 2)
                       &&
                       t1.numStatus == 1
                       &&
                       string.Compare(t1.dateEndContractDate, _pdate.PersianDate) <= 0
                   select new
                   {
                       t.numPersonelCode,
                   }).Count();

        string json = serializer.Serialize((object)cnt);

        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //----------------------------------کپی از قرارداد فعلی---------------
    //---------------------------------------------------------------------
    private void ReContractFromOldContract()
    {
        string personelcode = context.Request.Form["Code"];

        string MovaghtMonth = context.Request.Form["MovaghtMonth"];
        string MovaghtDAy = context.Request.Form["MovaghtDAy"];
        string MovaghtContractFromDate = context.Request.Form["MovaghtContractFromDate"];
        string MovaghtContractToDate = context.Request.Form["MovaghtContractToDate"];
        string MovaghtContractUnValidDate = context.Request.Form["MovaghtContractUnValidDate"];
        string PriceTamdidMain = context.Request.Form["PriceTamdidMain"];

        string SaatiMovaghtMonth = context.Request.Form["SaatiMovaghtMonth"];
        string SaatiMovaghtDAy = context.Request.Form["SaatiMovaghtDAy"];
        string SaatiContractFromDate = context.Request.Form["SaatiContractFromDate"];
        string SaatiContractToDate = context.Request.Form["SaatiContractToDate"];
        string SaatiContractTavafoghDate = context.Request.Form["SaatiContractTavafoghDate"];
        string SaatiContractTime = context.Request.Form["SaatiContractTime"];
        string SaatiTimeForMonth = context.Request.Form["SaatiTimeForMonth"];
        string SaatiWeekForMonth = context.Request.Form["SaatiWeekForMonth"];

        string ProjeiMovaghtMonth = context.Request.Form["ProjeiMovaghtMonth"];
        string ProjeiMovaghtDAy = context.Request.Form["ProjeiMovaghtDAy"];
        string ProjeiContractFromDate = context.Request.Form["ProjeiContractFromDate"];
        string ProjeiContractToDate = context.Request.Form["ProjeiContractToDate"];
        string ProjeiContractTavafoghDate = context.Request.Form["ProjeiContractTavafoghDate"];
        string ProjeiContractTime = context.Request.Form["ProjeiContractTime"];
        string ProjeiTimeForMonth = context.Request.Form["ProjeiTimeForMonth"];
        string ProjeiWeekForMonth = context.Request.Form["ProjeiWeekForMonth"];

        //string orgchart = "";
        //int PersonelCode = 0;
        int contractCode_old = 0;

        string[] personelcodearray = personelcode.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
        string retJson = "";
        var salmali = office.ofcSettings.Where(c => c.numStatus == 1).FirstOrDefault();

        foreach (var item in personelcodearray)
        {
            var ofcpersonel = office.ofcPersonels.Where(c => c.numPersonelCode == Convert.ToInt32(item) && (new int[] { 1, 2, 3, 4 }).Contains((int)c.numStatus)).FirstOrDefault();
            if (ofcpersonel != null)
            {
                try
                {
                    //======================================================================================
                    var checkContractActive = office.ofcPersonelContracts.Where(c => c.numPersonelRef == Convert.ToInt32(item) && c.numStatus == 1).FirstOrDefault();
                    if (checkContractActive != null)
                    {
                        ofcpersonel.numStatus = 0;
                        checkContractActive.numStatus = 0; // ghire faal kardane gharardade feli
                        contractCode_old = checkContractActive.numContractCode;

                        if (checkContractActive.numContractKindRef == 1)
                        {
                            ofcPersonelContract pContract = new ofcPersonelContract();
                            pContract.dateStartContractDate = MovaghtContractFromDate;
                            pContract.dateEndContractDate = MovaghtContractToDate;
                            pContract.dateUnvalidContractDate = MovaghtContractUnValidDate;
                            pContract.strContractMonth = MovaghtMonth;
                            pContract.strContractDay = MovaghtDAy;
                            pContract.dateCutWorkDate = MovaghtContractToDate;

                            pContract.numContractKindRef = checkContractActive.numContractKindRef;
                            pContract.numContractStateRef = checkContractActive.numContractStateRef;

                            pContract.numPriceHaghModiriat = checkContractActive.numPriceHaghModiriat;
                            pContract.numPriceJariEjareh = checkContractActive.numPriceJariEjareh;
                            pContract.numPriceJariTel = checkContractActive.numPriceJariTel;
                            pContract.numPriceJariNet = checkContractActive.numPriceJariNet;
                            pContract.numPriceJariAbogaz = checkContractActive.numPriceJariAbogaz;
                            pContract.numPricePorsantToziShode = checkContractActive.numPricePorsantToziShode;
                            pContract.numPricePorsantKharejMahdode = checkContractActive.numPricePorsantKharejMahdode;
                            pContract.numPricePorsantMoadeli = checkContractActive.numPricePorsantMoadeli;
                            pContract.numContractStateRef = checkContractActive.numContractStateRef;
                            pContract.numAgentArea = checkContractActive.numAgentArea;
                            pContract.numAnbarArea = checkContractActive.numAnbarArea;
                            pContract.strZemanatType = checkContractActive.strZemanatType;
                            pContract.numZemanatPrice = checkContractActive.numZemanatPrice;
                            pContract.numCountZemanatSafteh = checkContractActive.numCountZemanatSafteh;
                            pContract.strZemanatAllInfoSafteh = checkContractActive.strZemanatAllInfoSafteh;
                            pContract.numCountZemanatCheck = checkContractActive.numCountZemanatCheck;
                            pContract.strZemanatAllInfoCheck = checkContractActive.strZemanatAllInfoCheck;

                            if (PriceTamdidMain == "2")
                            {
                                pContract.numPersonelBon = checkContractActive.numPersonelBon;
                                pContract.numPersonelChildSalary = checkContractActive.numPersonelChildSalary;
                                pContract.numPersonelHomeSalary = checkContractActive.numPersonelHomeSalary;
                                pContract.numPersonelSalary = checkContractActive.numPersonelSalary;
                                pContract.numPersonelPadash = checkContractActive.numPersonelPadash;
                                pContract.numPersonelSaier = checkContractActive.numPersonelSaier;
                                pContract.numPersonelSanavat = checkContractActive.numPersonelSanavat;
                            }
                            else if (PriceTamdidMain == "1")
                            {
                                pContract.numPersonelBon = salmali.numPriceBon;
                                pContract.numPersonelHomeSalary = salmali.numPriceHomeSalary;
                                pContract.numPersonelSalary = salmali.numPriceSalary;
                                if (checkContractActive.numPersonelChildSalary > 0)
                                {
                                    if (Convert.ToInt32((Math.Round(Convert.ToDouble(checkContractActive.numPersonelChildSalary) / 0.2))) == checkContractActive.numPersonelSalary)
                                    {
                                        pContract.numPersonelChildSalary = Convert.ToInt32(Math.Round(Convert.ToInt32(salmali.numPriceSalary) * 0.2));

                                    }
                                    else
                                    {
                                        pContract.numPersonelChildSalary = Convert.ToInt32(Math.Round(Convert.ToInt32(salmali.numPriceSalary) * 0.1));
                                    }
                                }
                                else
                                {
                                    pContract.numPersonelChildSalary = checkContractActive.numPersonelChildSalary;
                                }
                                pContract.numPersonelPadash = checkContractActive.numPersonelPadash;
                                pContract.numPersonelSaier = checkContractActive.numPersonelSaier;
                                pContract.numPersonelSanavat = Convert.ToInt32(Math.Ceiling(Convert.ToDouble(salmali.numPriceSalary) / 12));
                            }
                            pContract.numPersonelRef = checkContractActive.numPersonelRef;
                            pContract.numStatus = 1;
                            pContract.dateDoreFromDate = "";// checkContractActive.dateDoreFromDate;
                            pContract.dateDoreToDate = "";// checkContractActive.dateDoreToDate;

                            pContract.timeRegisterTime = _PDate.PersianTime;
                            pContract.strRegisterUserRef = _ofcUser.strUserCode.Trim();
                            pContract.dateRegisterDate = _PDate.PersianDate;
                            pContract.dateEstekhdamDate = checkContractActive.dateEstekhdamDate;

                            //  pContract.numWorkGroupRef = checkContractActive.numWorkGroupRef;
                            office.ofcPersonelContracts.InsertOnSubmit(pContract);
                            office.SubmitChanges();
                            //======================================================================================
                            int numcode = pContract.numContractCode;
                            string uniqcontractCode = "";
                            string dateContractRegister = (_PDate.NowYear.Substring(2, _PDate.NowYear.Length - 2)) + "-" + _PDate.NowMonth + "-" + _PDate.NowDay;
                            if (numcode < 10) uniqcontractCode = dateContractRegister + "-0" + numcode.ToString();
                            else uniqcontractCode = dateContractRegister + "-" + numcode.ToString();
                            //======================================================================================
                            var contractCheck = office.ofcPersonelContracts.Where(c => c.numContractCode == numcode).FirstOrDefault();
                            if (contractCheck != null) contractCheck.StrContractUniqCode = uniqcontractCode;
                            //======================================================================================

                            var checkposition = office.ofcPersonelChartPositions.Where(c => c.numPersonelRef == Convert.ToInt32(item) && c.numContractRef == contractCode_old);
                            if (checkposition.Any())
                            {
                                foreach (var pos in checkposition)
                                {
                                    office.ofcPersonelChartPositions.InsertOnSubmit(new ofcPersonelChartPosition
                                    {
                                        numPersonelRef = Convert.ToInt32(item),
                                        numChartPositionRef = pos.numChartPositionRef,
                                        numContractRef = numcode,
                                    });
                                }
                            }

                            var checkAssignAgent = office.ofcPersonelAssignAgents.Where(c => c.numPersonelRef == Convert.ToInt32(item) && c.numContractRef == contractCode_old);
                            if (checkAssignAgent.Any())
                            {
                                foreach (var pos in checkAssignAgent)
                                {
                                    office.ofcPersonelAssignAgents.InsertOnSubmit(new ofcPersonelAssignAgent
                                    {
                                        numPersonelRef = Convert.ToInt32(item),
                                        strPersonMelliRef = pos.strPersonMelliRef,
                                        numContractRef = numcode,
                                    });
                                }
                            }

                            var checktransporter = office.ofcPersonelTransporterKinds.Where(c => c.numPersonelRef == Convert.ToInt32(item) && c.numContractRef == contractCode_old);
                            if (checktransporter.Any())
                            {
                                foreach (var transport in checktransporter)
                                {
                                    office.ofcPersonelTransporterKinds.InsertOnSubmit(new ofcPersonelTransporterKind
                                    {
                                        numPersonelRef = Convert.ToInt32(item),
                                        numTransporterKind = transport.numTransporterKind,
                                        strColor = transport.strColor,
                                        strModel = transport.strModel,
                                        strNumBody = transport.strNumBody,
                                        strNumShahrbani = transport.strNumShahrbani,
                                        strNumShasi = transport.strNumShasi,
                                        strOwnerName = transport.strOwnerName,
                                        numContractRef = numcode
                                    });
                                }
                            }

                            //var qcheckWorkGroupLogs = office.ofcPersonelWorkGroupLogs.Where(c => c.numPersonelRef == Convert.ToInt32(item)).OrderByDescending(c => c.numWorkgroupLogCode).Take(1).FirstOrDefault();
                            //if (qcheckWorkGroupLogs != null)
                            //{
                            //    office.ofcPersonelWorkGroupLogs.InsertOnSubmit(new ofcPersonelWorkGroupLog
                            //    {
                            //        numGhesmatWorkgroupRef = qcheckWorkGroupLogs.numGhesmatWorkgroupRef,
                            //        numBakhshWorkGroupRef = qcheckWorkGroupLogs.numBakhshWorkGroupRef,
                            //        numWorkGroupRef = qcheckWorkGroupLogs.numWorkGroupRef,
                            //        numPersonelRef = qcheckWorkGroupLogs.numPersonelRef,
                            //        strRegisterUserRef = _ofcUser.strUserCode,
                            //        dateRegisterDate = _PDate.PersianDate,
                            //        timeRegisterTime = _PDate.PersianTime,
                            //        numContractRef = numcode
                            //    });
                            //}


                            //orgchart = orgchart.Replace("\"", "");
                            //string[] orgchartArray = { "" };

                            //if (orgchart != "-1")
                            //{
                            //    orgchartArray = orgchart.Split(',').Where(c => !(String.IsNullOrEmpty(c))).ToArray();
                            //    orgchart = "";
                            //}

                            //foreach (var items in orgchartArray)
                            //{
                            //    var qorgchart = office.ofcChartPositions.Where(c => c.numOrgChartRef == 43 && c.numOrgPositionRef == Convert.ToInt32(items)).FirstOrDefault();
                            //    if (qorgchart != null)
                            //    {
                            //        var checkpersonelchart = office.ofcPersonelChartPositions.Where(c => c.numPersonelRef == PersonelCode && c.numChartPositionRef == Convert.ToInt32(qorgchart.numChartPositionCode) && c.numContractRef == numcode).FirstOrDefault();
                            //        if (checkpersonelchart == null)
                            //        {
                            //            office.ofcPersonelChartPositions.InsertOnSubmit(new ofcPersonelChartPosition
                            //            {
                            //                numPersonelRef = PersonelCode,
                            //                numChartPositionRef = Convert.ToInt32(qorgchart.numChartPositionCode),
                            //                numContractRef = numcode,
                            //            });
                            //        }
                            //    }
                            //}



                            office.SubmitChanges();
                            retJson = "1";
                        }
                        else if (checkContractActive.numContractKindRef == 2 || checkContractActive.numContractKindRef == 3)
                        {
                            ofcPersonelContract pContract = new ofcPersonelContract();

                            if (checkContractActive.numContractKindRef == 2)
                            {
                                pContract.strContractMonth = SaatiMovaghtMonth;
                                pContract.strContractDay = SaatiMovaghtDAy;
                                pContract.dateStartContractDate = SaatiContractFromDate;
                                pContract.dateEndContractDate = SaatiContractToDate;
                                pContract.dateRegisterContractDate = SaatiContractTavafoghDate;
                                pContract.StrKarKardTime = SaatiContractTime + "-" + SaatiTimeForMonth + "-" + SaatiWeekForMonth;
                                pContract.dateCutWorkDate = SaatiContractToDate;
                            }
                            else if (checkContractActive.numContractKindRef == 3)
                            {
                                pContract.strContractMonth = ProjeiMovaghtMonth;
                                pContract.strContractDay = ProjeiMovaghtDAy;
                                pContract.dateStartContractDate = ProjeiContractFromDate;
                                pContract.dateEndContractDate = ProjeiContractToDate;
                                pContract.dateRegisterContractDate = ProjeiContractTavafoghDate;
                                pContract.StrKarKardTime = ProjeiContractTime + "-" + ProjeiTimeForMonth + "-" + ProjeiWeekForMonth;
                                pContract.dateCutWorkDate = ProjeiContractToDate;
                            }

                            pContract.numContractKindRef = checkContractActive.numContractKindRef;
                            pContract.numPersonelBon = checkContractActive.numPersonelBon;
                            pContract.numPersonelChildSalary = checkContractActive.numPersonelChildSalary;
                            pContract.numPersonelHomeSalary = checkContractActive.numPersonelHomeSalary;
                            pContract.numPersonelRef = checkContractActive.numPersonelRef;
                            pContract.numPersonelPadash = checkContractActive.numPersonelPadash;
                            pContract.numPersonelSaier = checkContractActive.numPersonelSaier;
                            pContract.numPersonelSanavat = checkContractActive.numPersonelSanavat;
                            pContract.numPersonelSalary = checkContractActive.numPersonelSalary;
                            pContract.numPriceEidi = checkContractActive.numPriceEidi;
                            pContract.numPriceLeave = checkContractActive.numPriceLeave;
                            pContract.strKhadamatDescription = checkContractActive.strKhadamatDescription;
                            pContract.numStatus = 1;

                            pContract.timeRegisterTime = _PDate.PersianTime;
                            pContract.strRegisterUserRef = _ofcUser.strUserCode;
                            pContract.dateRegisterDate = _PDate.PersianDate;
                            pContract.numEndOfKind = checkContractActive.numEndOfKind;
                            pContract.strTitleFaraiand = checkContractActive.strTitleFaraiand;
                            pContract.dateEstekhdamDate = checkContractActive.dateEstekhdamDate;

                            pContract.numContractStateRef = checkContractActive.numContractStateRef;

                            pContract.numPriceHaghModiriat = checkContractActive.numPriceHaghModiriat;
                            pContract.numPriceJariEjareh = checkContractActive.numPriceJariEjareh;
                            pContract.numPriceJariTel = checkContractActive.numPriceJariTel;
                            pContract.numPriceJariNet = checkContractActive.numPriceJariNet;
                            pContract.numPriceJariAbogaz = checkContractActive.numPriceJariAbogaz;
                            pContract.numPricePorsantToziShode = checkContractActive.numPricePorsantToziShode;
                            pContract.numPricePorsantKharejMahdode = checkContractActive.numPricePorsantKharejMahdode;
                            pContract.numPricePorsantMoadeli = checkContractActive.numPricePorsantMoadeli;
                            pContract.numContractStateRef = checkContractActive.numContractStateRef;
                            pContract.numAgentArea = checkContractActive.numAgentArea;
                            pContract.numAnbarArea = checkContractActive.numAnbarArea;
                            pContract.strZemanatType = checkContractActive.strZemanatType;
                            pContract.numZemanatPrice = checkContractActive.numZemanatPrice;
                            pContract.numCountZemanatSafteh = checkContractActive.numCountZemanatSafteh;
                            pContract.strZemanatAllInfoSafteh = checkContractActive.strZemanatAllInfoSafteh;

                            pContract.numCountZemanatCheck = checkContractActive.numCountZemanatCheck;
                            pContract.strZemanatAllInfoCheck = checkContractActive.strZemanatAllInfoCheck;

                            // pContract.numWorkGroupRef = checkContractActive.numWorkGroupRef;

                            office.ofcPersonelContracts.InsertOnSubmit(pContract);
                            office.SubmitChanges();
                            //======================================================================================
                            int numcode = pContract.numContractCode;
                            string uniqcontractCode = "";
                            string dateContractRegister = (_PDate.NowYear.Substring(2, _PDate.NowYear.Length - 2)) + "-" + _PDate.NowMonth + "-" + _PDate.NowDay;
                            if (numcode < 10) uniqcontractCode = dateContractRegister + "-0" + numcode.ToString();
                            else uniqcontractCode = dateContractRegister + "-" + numcode.ToString();
                            //======================================================================================
                            var contractCheck = office.ofcPersonelContracts.Where(c => c.numContractCode == numcode).FirstOrDefault();
                            if (contractCheck != null) contractCheck.StrContractUniqCode = uniqcontractCode;
                            //======================================================================================
                            if (checkContractActive.numContractKindRef == 3)
                            {
                                var checkposition = office.ofcPersonelChartPositions.Where(c => c.numPersonelRef == Convert.ToInt32(item) && c.numContractRef == contractCode_old);
                                if (checkposition.Any())
                                {
                                    foreach (var pos in checkposition)
                                    {
                                        office.ofcPersonelChartPositions.InsertOnSubmit(new ofcPersonelChartPosition
                                        {
                                            numPersonelRef = Convert.ToInt32(item),
                                            numChartPositionRef = pos.numChartPositionRef,
                                            numContractRef = numcode,
                                        });
                                    }
                                }


                                var checkAssignAgent = office.ofcPersonelAssignAgents.Where(c => c.numPersonelRef == Convert.ToInt32(item) && c.numContractRef == contractCode_old);
                                if (checkAssignAgent.Any())
                                {
                                    foreach (var pos in checkAssignAgent)
                                    {
                                        office.ofcPersonelAssignAgents.InsertOnSubmit(new ofcPersonelAssignAgent
                                        {
                                            numPersonelRef = Convert.ToInt32(item),
                                            strPersonMelliRef = pos.strPersonMelliRef,
                                            numContractRef = numcode,
                                        });
                                    }
                                }
                            }


                            var checktransporter = office.ofcPersonelTransporterKinds.Where(c => c.numPersonelRef == Convert.ToInt32(item) && c.numContractRef == contractCode_old);
                            if (checktransporter.Any())
                            {
                                foreach (var transport in checktransporter)
                                {
                                    office.ofcPersonelTransporterKinds.InsertOnSubmit(new ofcPersonelTransporterKind
                                    {
                                        numPersonelRef = Convert.ToInt32(item),
                                        numTransporterKind = transport.numTransporterKind,
                                        strColor = transport.strColor,
                                        strModel = transport.strModel,
                                        strNumBody = transport.strNumBody,
                                        strNumShahrbani = transport.strNumShahrbani,
                                        strNumShasi = transport.strNumShasi,
                                        strOwnerName = transport.strOwnerName,
                                        numContractRef = numcode
                                    });
                                }
                            }
                            //}
                            //var qcheckWorkGroupLogs = office.ofcPersonelWorkGroupLogs.Where(c => c.numPersonelRef == Convert.ToInt32(item)).OrderByDescending(c => c.numWorkgroupLogCode).Take(1).FirstOrDefault();
                            //if (qcheckWorkGroupLogs != null)
                            //{
                            //    office.ofcPersonelWorkGroupLogs.InsertOnSubmit(new ofcPersonelWorkGroupLog
                            //    {
                            //        numGhesmatWorkgroupRef = qcheckWorkGroupLogs.numGhesmatWorkgroupRef,
                            //        numBakhshWorkGroupRef = qcheckWorkGroupLogs.numBakhshWorkGroupRef,
                            //        numWorkGroupRef = qcheckWorkGroupLogs.numWorkGroupRef,
                            //        numPersonelRef = qcheckWorkGroupLogs.numPersonelRef,
                            //        strRegisterUserRef = _ofcUser.strUserCode,
                            //        dateRegisterDate = _PDate.PersianDate,
                            //        timeRegisterTime = _PDate.PersianTime,
                            //        numContractRef = numcode
                            //    });
                            //}

                            office.SubmitChanges();
                            retJson = "1";
                        }
                    }
                }
                catch
                {
                    retJson = "3"; // khata
                }

            }
            else
            {
                retJson = "2"; //personel not found
            }
        }

        string json = serializer.Serialize((object)retJson); // 

        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------------تعداد پرسنلی که گروه کاری ندارند-------------
    //---------------------------------------------------------------------
    private void GetCountPersonelWorkGroupNon()
    {
        int cnt = (from t in office.ofcPersonelContracts
                   join t1 in office.ofcPersonels on t.numPersonelRef equals t1.numPersonelCode
                   where
                       (t1.numStatus == 1 || t1.numStatus == 2)
                       &&
                       t.numStatus == 1
                       &&
                       t.numWorkGroupRef == null
                   select new
                   {
                       t.numPersonelRef,
                   }).Count();


        string json = serializer.Serialize((object)cnt);

        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------------قطع همکاری پرسنل -------------
    //---------------------------------------------------------------------
    private void CutContractPersonel()
    {
        string personelcode = context.Request.Form["personelcode"];
        string json = "";
        var preinvoiceCheck = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == Convert.ToInt32(personelcode) && c.numStatus != 0).OrderByDescending(c => c.strInvoiceYear).ThenByDescending(c => c.strInvoiceMonth).Take(1).FirstOrDefault();
        if (preinvoiceCheck != null)
        {
            if (preinvoiceCheck.numStatus != 2)
            {
                preinvoiceCheck.numStatus = 2;
            }
        }
        else
        {
            var preinvoiceSaatiCheck = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numPersonelRef == Convert.ToInt32(personelcode) && c.numStatus != 0).OrderByDescending(c => c.strInvoiceYear).ThenByDescending(c => c.strInvoiceMonth).Take(1).FirstOrDefault();
            if (preinvoiceSaatiCheck != null)
            {
                if (preinvoiceSaatiCheck.numStatus != 2)
                {
                    preinvoiceSaatiCheck.numStatus = 2;
                }
            }
        }

        var personelcheck = office.ofcPersonels.Where(c => c.numPersonelCode == Convert.ToInt32(personelcode) && (c.numStatus == 1 || c.numStatus == 2)).FirstOrDefault();
        if (personelcheck != null) personelcheck.numStatus = 3;

        var contractCheck = office.ofcPersonelContracts.Where(c => c.numPersonelRef == Convert.ToInt32(personelcode) && c.numStatus == 1).FirstOrDefault();
        if (contractCheck != null) contractCheck.numStatus = 0;

        try
        {
            office.SubmitChanges();
            json = serializer.Serialize((object)"1");
        }
        catch
        {
            json = serializer.Serialize((object)"3");
        }

        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------------معلق کردن پرسنل -------------
    //---------------------------------------------------------------------
    private void ChangePersoenlStatusTomoalagh()
    {
        string mellicode = context.Request.Form["mellicode"];
        string isbool = context.Request.Form["isbool"];
        string json = "";

        if (isbool == "checked")
        {
            var checkpersonel = office.ofcPersonels.Where(c => c.strMelliCode.Trim() == mellicode.Trim() && c.numStatus == 4).FirstOrDefault();
            if (checkpersonel != null)
            {
                if (checkpersonel.numBlodRef == null) checkpersonel.numStatus = 1;
                else checkpersonel.numStatus = 2;

                try
                {
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1");
                }
                catch
                {
                    json = serializer.Serialize((object)"3");
                }
            }
            else
            {
                json = serializer.Serialize((object)"2");
            }

        }
        else
        {
            var checkpersonel = office.ofcPersonels.Where(c => c.strMelliCode.Trim() == mellicode.Trim() && (c.numStatus == 1 || c.numStatus == 2)).FirstOrDefault();
            if (checkpersonel != null)
            {
                checkpersonel.numStatus = 4;

                try
                {
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1");
                }
                catch
                {
                    json = serializer.Serialize((object)"3");
                }

            }
            else
            {
                json = serializer.Serialize((object)"2");

            }
        }

        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------------تعداد موزعین جدید ثبت شده در سیستم-------------
    //---------------------------------------------------------------------
    private void GetCountNewPeik()
    {
        int cnt = (from t in office.ofcPrePersonels
                   where
                       (t.numStatus == 0)
                   select new
                   {
                       t.strMelliCode,
                   }).Count();

        string json = serializer.Serialize((object)cnt);

        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------------گزارش موزعین جدید ثبت شده در سیستم------------
    //---------------------------------------------------------------------
    private class lstAgent
    {
        public string strPersonMelliRef { get; set; }
        public string strAgcNam { get; set; }
        public string strHomeCityPreTelCode { get; set; }
        public string strHomePostCenterRef { get; set; }
    }
    private void GetReportNewPeik()
    {
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string agent = context.Request.Form["agent"];
        string ContractKind = context.Request.Form["ContractKind"];
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        agent = String.IsNullOrEmpty(agent) ? "-1" : agent.Trim();
        ContractKind = String.IsNullOrEmpty(ContractKind) ? "-1" : ContractKind.Trim();

        pltdDataContext pltd = new pltdDataContext(func.setapcstr.Trim());
        List<lstAgent> lst = new List<lstAgent>();
        lst = (from tt in pltd.agcPersons
               select new lstAgent
               {
                   strPersonMelliRef = tt.strPersonMelliCode.Trim(),
                   strAgcNam = tt.strAgcName.Trim()
               }).ToList();


        var qq = (from t in office.ofcPrePersonels
                  where
                      (t.numStatus == 0)
                      &&
                      (t.strRegisterUserRef.Trim() == agent.Trim() || agent == "-1")
                      &&
                      (t.numContractKindStatus == Convert.ToInt16(ContractKind) || ContractKind == "-1")
                      &&
                      ((t.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                      ||
                      (t.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                      ||
                      name == "")
                      &&
                      (t.strMelliCode.Trim() == mellicode.Trim() || mellicode.Trim() == "")
                  select new
                  {
                      t.strMelliCode,
                      strPersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                      t.dateRegisterDate,
                      t.numContractKindStatus,
                      t.strRegisterUserRef
                  }).ToList();

        var q = (from t in qq
                 join t1 in lst on t.strRegisterUserRef equals t1.strPersonMelliRef
                 select new
                 {
                     t.strMelliCode,
                     t.strPersonelName,
                     t.dateRegisterDate,
                     t.numContractKindStatus,
                     t.strRegisterUserRef,
                     t1.strAgcNam
                 }).ToList();

        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = q.Count();
        var query = q.OrderBy(o => o.dateRegisterDate).ThenBy(c => c.strAgcNam).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);

        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //-------------------------تکمیل اطلاعات موزع-------------------------
    //---------------------------------------------------------------------
    private void CompleteInfoPeikPersonel()
    {
        string mellicode = context.Request.Form["mellicode"];
        string json = "";
        int hoghoghsabet = func.hoghoghSabet;
        int numpersonelcode = 0;
        int contractcode = 0;
        string agentcode = "-1";

        var contract22 = (from t in office.ofcPersonelContracts
                          join t1 in office.ofcPersonels on t.numPersonelRef equals t1.numPersonelCode
                          where
                          t1.strMelliCode.Trim() == mellicode.Trim()
                          &&
                          t.numStatus == 1
                          select t).ToList();
        if (contract22.Any())
        {
            contractcode = contract22.FirstOrDefault().numContractCode;
            numpersonelcode = Convert.ToInt32(contract22.FirstOrDefault().numPersonelRef);

            var agentq = (from t in office.ofcPersonelAssignAgents
                          where
                            (t.numPersonelRef == numpersonelcode && t.numContractRef == contractcode)
                          select new
                          {
                              t.strPersonMelliRef,
                          }).FirstOrDefault();

            if (agentq != null)
                agentcode = agentq.strPersonMelliRef.Trim();
        }

        var checkMelliCode = (from t in office.ofcPrePersonels
                              where t.strMelliCode.Trim() == mellicode.Trim()
                              &&
                              t.numStatus == 0
                              select new
                              {
                                  t.numMarridRef,
                                  t.strNumberShenasname,
                                  strWorkCityRef = GetInfoPerson(t.strRegisterUserRef, 1),
                                  strWorkProvinceRef = GetInfoPerson(t.strRegisterUserRef, 2),
                                  t.strExportCityRef,
                                  t.strFatherName,
                                  t.strMelliCode,
                                  t.strPersonelAddress,
                                  t.strPersonelFamily,
                                  t.strPersonelName,
                                  t.strPostCode,
                                  strMobile = t.strMobile == null ? "0" : t.strMobile,
                                  strTel = t.strTel == null ? "0-0" : t.strTel,
                                  t.dateBrithdayDate,
                                  numEmployerRef = 1,
                                  t.numJensiatRef,
                                  strPersonalPass = "",
                                  numPersonelCode = 0,
                                  numContractKindRef = t.numContractKindStatus == 2 ? 1 : 3,
                                  numPriceSalary = t.numContractKindStatus == 2 ? (t.numPriceSalary > 0 ? (((Convert.ToInt32(t.numPriceSalary) - hoghoghsabet) == 0 || (Convert.ToInt32(t.numPriceSalary) < hoghoghsabet)) ? Convert.ToInt32(t.numPriceSalary) : hoghoghsabet) : 0) : t.numContractKindStatus == 1 ? 0 : t.numContractKindStatus == 3 ? t.numPriceSalary : 0,
                                  numPricePorsant = t.numContractKindStatus == 1 ? t.numPricePorsant : t.numContractKindStatus == 2 ? (t.numPriceSalary > 0 ? (((Convert.ToInt32(t.numPriceSalary) - hoghoghsabet) == 0 || (Convert.ToInt32(t.numPriceSalary) < hoghoghsabet)) ? 0 : (Convert.ToInt32(t.numPriceSalary) - hoghoghsabet)) : 0) : t.numContractKindStatus == 3 ? t.numPricePorsant : 0,
                                  agentcode
                              }).ToList();
        if (checkMelliCode.Count() > 0)
        {
            json = serializer.Serialize((object)checkMelliCode);
        }
        else
        {
            json = serializer.Serialize((object)"2");
        }


        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    private string GetInfoPerson(string code, int type)
    {
        string ret = "";
        pltdDataContext pltd = new pltdDataContext(func.setapcstr.Trim());
        List<lstAgent> lst = new List<lstAgent>();
        lst = (from tt in pltd.agcPersons
               where tt.strPersonMelliCode.Trim() == code.Trim()
               select new lstAgent
               {
                   strPersonMelliRef = tt.strPersonMelliCode.Trim(),
                   strAgcNam = tt.strAgcName.Trim(),
                   strHomeCityPreTelCode = tt.strHomeCityPreTelCode,
                   strHomePostCenterRef = tt.strHomePostCenterRef
               }).ToList();

        if (type == 1)
            ret = office.ofcBCities.Where(c => c.strCityPreTelCode.Trim() == lst.FirstOrDefault().strHomeCityPreTelCode.Trim()).FirstOrDefault().strCityCode.Trim();
        else if (type == 2)
            ret = office.ofcBCities.Where(c => c.strPostCenterRef.Trim() == lst.FirstOrDefault().strHomePostCenterRef.Trim()).FirstOrDefault().numProvinceRef.ToString();
        return ret;
    }
    //---------------------------------------------------------------------
    //-------------------------محاسبه ماه و روز-------------------------
    //---------------------------------------------------------------------
    private void GetBetweenDateMonthAndDay()
    {
        string datestart = context.Request.Form["mellicode"];
        string dateEnd = context.Request.Form["mellicode"];

        string json = "";
        int DaykarkardInmonth = Convert.ToInt32(office.CountdateBetweenDate(datestart, dateEnd));

        int startMonth = Convert.ToInt32(datestart.Split('/')[1]);
        int startYear = Convert.ToInt32(datestart.Split('/')[0]);

        int endMonth = Convert.ToInt32(dateEnd.Split('/')[1]);
        int endYear = Convert.ToInt32(dateEnd.Split('/')[0]);

        DateTime Date1 = Convert.ToDateTime(office.UDF_Julian_To_Gregorian(office.UDF_Persian_To_Julian(Convert.ToInt32(datestart.Split('/')[0]), Convert.ToInt32(datestart.Split('/')[1]), Convert.ToInt32(datestart.Split('/')[2]))));
        DateTime Date2 = Convert.ToDateTime(office.UDF_Julian_To_Gregorian(office.UDF_Persian_To_Julian(Convert.ToInt32(dateEnd.Split('/')[0]), Convert.ToInt32(dateEnd.Split('/')[1]), Convert.ToInt32(dateEnd.Split('/')[2]))));
        int months = (Date2.Year - Date1.Year) * 12 + Date2.Month - Date1.Month;


        var dayInMonthStart = office.ofcDayWorkIntoMonths.Where(t => t.numMonthJob == startMonth && t.numYear == startYear).FirstOrDefault();
        var dayInMonthEnd = office.ofcDayWorkIntoMonths.Where(t => t.numMonthJob == endMonth && t.numYear == endYear).FirstOrDefault();





        json = serializer.Serialize((object)"2");

        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}