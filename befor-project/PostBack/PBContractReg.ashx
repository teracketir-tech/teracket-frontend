<%@ WebHandler Language="C#" Class="PBContractReg" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.SessionState;
using System.IO;
public class PBContractReg : IHttpHandler, IReadOnlySessionState
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
                    RegisterPersonel();//ثبت کارمند جدید
                    break;
                case 3:
                    UpFilePersonel();//آپلود مدارک پرسنل
                    break;
                case 4:
                    DeleteFileTemp();//حذف عکس های آپلود شده در صورت وجود
                    break;
                case 5:
                    GetInfoPersonelByCode();//دریافت اطلاعات پرسنلی با کد پرسنل
                    break;
                case 6:
                    GetReportPersonel();//دریافت اطلاعات پرسنلی 
                    break;

            }
        }
    }
    //---------------------------------------------------------------------
    //------------------------------دریافت کل دراگ دان ها---------------------------------------
    //---------------------------------------------------------------------
    public void GetAlldrpdwnRegisterPersonel()
    {
        var jensiat = from t in office.ofcBJensiats
                      where t.numStatus == 1
                      select new
                      {
                          value = t.numJensiatCode,
                          item = t.strJensiatName
                      };
        var military = from t in office.ofcBMilitaryExempts
                       where t.numStatus == 1
                       select new
                       {
                           value = t.numMilitaryCode,
                           item = t.strMilitaryName
                       };

        var religion = from t in office.ofcBReligions
                       where t.numStatus == 1
                       select new
                       {
                           value = t.numReligionCode,
                           item = t.strReligionName
                       };
        var blod = from t in office.ofcBBlods
                   where t.numStatus == 1
                   select new
                   {
                       value = t.numBlodCode,
                       item = t.strBlodName
                   };

        var Marrid = from t in office.ofcBMarrids
                     where t.numStatus == 1
                     select new
                     {
                         value = t.numMarridCode,
                         item = t.strMarridName
                     };

        var hosing = from t in office.ofcBHosingStatus
                     where t.numStatus == 1
                     select new
                     {
                         value = t.numHosingCode,
                         item = t.strHosingName
                     };
        var univercitysection = from t in office.ofcBUniversitySections
                                where t.numStatus == 1
                                select new
                                {
                                    value = t.numUniversitySectionCode,
                                    item = t.strUniversitySectionName
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

        var LanguageStates = from t in office.ofcBLanguageStates
                             select new
                             {
                                 value = t.numLanguageStateCode,
                                 item = t.strLanguageStateName,
                             };

        var UnitOrganizations = from t in office.ofcBUnitOrganizations
                                select new
                                {
                                    value = t.numUnitOrganizationCode,
                                    item = t.strUnitOrganizationName,
                                };
        //var ContractKinds = from t in office.ofcBContractKinds
        //                    select new
        //                    {
        //                        value = t.numContractKindCode,
        //                        item = t.strContractKindName,
        //                    };
        //var JobStatus = from t in office.ofcBJobStatus
        //                select new
        //                {
        //                    value = t.numJobStatusCode,
        //                    item = t.strJobStatusName,
        //                };
        string json1 = serializer.Serialize((object)jensiat);
        string json2 = serializer.Serialize((object)military);
        string json3 = serializer.Serialize((object)religion);
        string json4 = serializer.Serialize((object)blod);
        string json5 = serializer.Serialize((object)Marrid);
        string json6 = serializer.Serialize((object)hosing);
        string json7 = serializer.Serialize((object)univercitysection);
        string json8 = serializer.Serialize((object)privonce);
        string json9 = serializer.Serialize((object)city);
        string json10 = serializer.Serialize((object)LanguageStates);
        string json11 = serializer.Serialize((object)UnitOrganizations);
        //  string json12 = serializer.Serialize((object)ContractKinds);
        //  string json13 = serializer.Serialize((object)JobStatus);

        string json = "[" + json1 + "," + json2 + "," + json3 + "," + json4 + "," + json5 + "," + json6 + "," + json7 + "," + json8 + "," + json9 + "," + json10 + "," + json11 + "]"; //," + json12 + "," + json13 + "]";
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    public void RegisterPersonel()
    {
        int personelCode = Convert.ToInt32(context.Request.Form["personelCode"]);
        string name = context.Request.Form["name"];
        string family = context.Request.Form["family"];
        string fathername = context.Request.Form["fathername"];
        string mellicode = context.Request.Form["mellicode"];
        string NumberShenasname = context.Request.Form["NumberShenasname"];
        string MosalsalShenasname = context.Request.Form["MosalsalShenasname"];
        string dateBrithdayDate = context.Request.Form["dateBrithdayDate"];
        string BrithdayCityRef = context.Request.Form["BrithdayCityRef"];
        string ExportCityRef = context.Request.Form["ExportCityRef"];
        string Meliat = context.Request.Form["Meliat"];
        string Jensiat = context.Request.Form["Jensiat"];
        string Blod = context.Request.Form["Blod"];
        string Religion = context.Request.Form["Religion"];
        string Gilder = context.Request.Form["Gilder"];
        string Marrid = context.Request.Form["Marrid"];
        string CntChild = context.Request.Form["CntChild"];
        string InfoMarrid = context.Request.Form["InfoMarrid"];
        string InfoChild = context.Request.Form["InfoChild"];
        string Military = context.Request.Form["Military"];
        string Province = context.Request.Form["Province"];
        string City = context.Request.Form["City"];
        string Hosing = context.Request.Form["Hosing"];
        string PostCode = context.Request.Form["PostCode"];
        string tel = context.Request.Form["tel"];
        string mobile = context.Request.Form["mobile"];
        string TelNecessary = context.Request.Form["TelNecessary"];
        string Email = context.Request.Form["Email"];
        string PersonelAddress = context.Request.Form["PersonelAddress"];
        string UniversityInfo = context.Request.Form["UniversityInfo"];
        string DoreInfo = context.Request.Form["DoreInfo"];
        string LangugeInfo = context.Request.Form["LangugeInfo"];
        string MaharatInfo = context.Request.Form["MaharatInfo"];
        string JobHistoryInfo = context.Request.Form["JobHistoryInfo"];

        InfoMarrid = String.IsNullOrEmpty(InfoMarrid) ? "" : InfoMarrid;
        InfoChild = String.IsNullOrEmpty(InfoChild) ? "" : InfoChild;
        UniversityInfo = String.IsNullOrEmpty(UniversityInfo) ? "" : UniversityInfo;
        DoreInfo = String.IsNullOrEmpty(DoreInfo) ? "" : DoreInfo;
        LangugeInfo = String.IsNullOrEmpty(LangugeInfo) ? "" : LangugeInfo;
        MaharatInfo = String.IsNullOrEmpty(MaharatInfo) ? "" : MaharatInfo;
        JobHistoryInfo = String.IsNullOrEmpty(JobHistoryInfo) ? "" : JobHistoryInfo;
        string json = "";


        var ofcpersonel = office.ofcPersonels.Where(c => c.numPersonelCode == personelCode).FirstOrDefault();
        if (ofcpersonel != null)
        {
            if (ofcpersonel.strMelliCode.Trim() == mellicode.Trim())
            {
                try
                {
                    ofcpersonel.numBlodRef = Convert.ToInt16(Blod);
                    ofcpersonel.numHosingRef = Convert.ToInt16(Hosing);
                    ofcpersonel.numJensiatRef = Convert.ToInt16(Jensiat);
                    ofcpersonel.numMarridRef = Convert.ToInt16(Marrid);
                    if (!String.IsNullOrEmpty(Military)) ofcpersonel.numMilitaryRef = Convert.ToInt16(Military);
                    else ofcpersonel.numMilitaryRef = -1;
                    ofcpersonel.numReligionRef = Convert.ToInt16(Religion);
                    ofcpersonel.numStatus = 2;
                    ofcpersonel.strNumberShenasname = NumberShenasname;
                    ofcpersonel.strBrithdayCityRef = BrithdayCityRef;
                    ofcpersonel.strCityRef = City;
                    ofcpersonel.strEmail = Email;
                    ofcpersonel.strExportCityRef = ExportCityRef;
                    ofcpersonel.strFatherName = fathername;
                    ofcpersonel.strGilderName = Gilder;
                    ofcpersonel.numMeliat = Convert.ToInt16(Meliat);
                    ofcpersonel.strMelliCode = mellicode;
                    ofcpersonel.strMobile = mobile;
                    ofcpersonel.strMosalsalShenasname = MosalsalShenasname;
                    //ofcpersonel.strPersonalPass = "123";
                    ofcpersonel.strPersonelAddress = PersonelAddress;
                    ofcpersonel.strPersonelFamily = family;
                    ofcpersonel.strPersonelName = name;
                    ofcpersonel.strPostCode = PostCode;
                    ofcpersonel.strProvinceRef = Province;
                    ofcpersonel.strRegisterUserRef = _ofcUser.strUserCode;
                    ofcpersonel.strTel = tel;
                    ofcpersonel.strTelNecessary = TelNecessary;
                    //ofcpersonel.strPersonelPic = "";
                    //ofcpersonel.strSignaturePic = "";
                    ofcpersonel.dateBrithdayDate = dateBrithdayDate;
                    ofcpersonel.dateRegisterDate = _PDate.PersianDate;
                    ofcpersonel.timeRegisterTime = _PDate.PersianTime;


                    //office.ofcPersonels.InsertOnSubmit(ofcpersonel);
                    //office.SubmitChanges();
                    //int personalcode = ofcpersonel.numPersonelCode;
                    //======================================================================================
                    if (Marrid == "2")
                    {
                        var MarridInfoCheck = office.ofcPersonelMarridInfos.Where(c => c.numPersonelRef == personelCode);
                        if (MarridInfoCheck.Count() > 0)
                        {
                            office.ofcPersonelMarridInfos.DeleteAllOnSubmit(MarridInfoCheck);
                        }

                        string[] arrayMarridInfo = InfoMarrid.Split(',');
                        foreach (var item in arrayMarridInfo)
                        {
                            if (item.Trim() != "")
                            {
                                string[] arrayInfo2 = item.Split('^');
                                office.ofcPersonelMarridInfos.InsertOnSubmit(new ofcPersonelMarridInfo
                                {
                                    numPersonelRef = personelCode,
                                    strPersonName = arrayInfo2[0].Trim(),
                                    strPersonFamily = arrayInfo2[1].Trim(),
                                    strRegisterUserRef = _ofcUser.strUserCode,
                                    dateRegisterDate = _PDate.PersianDate,
                                    strPersonMelliCode = arrayInfo2[2].Trim(),
                                    strNumberShenasname = arrayInfo2[3].Trim(),
                                    dateMarridBrithdayDate = arrayInfo2[4].Trim(),
                                    dateMarridDate = arrayInfo2[5].Trim()
                                });
                            }
                        }
                    }
                    if (Marrid == "2" || Marrid == "3")
                    {
                        //======================================================================================
                        var ChildInfoCheck = office.ofcPersonelChildInfos.Where(c => c.numPersonelRef == personelCode);
                        if (ChildInfoCheck.Count() > 0)
                        {
                            office.ofcPersonelChildInfos.DeleteAllOnSubmit(ChildInfoCheck);
                        }

                        string[] arrayChildInfo = InfoChild.Split(',');
                        foreach (var item in arrayChildInfo)
                        {
                            if (item.Trim() != "")
                            {
                                string[] arrayInfo2 = item.Split('^');
                                office.ofcPersonelChildInfos.InsertOnSubmit(new ofcPersonelChildInfo
                                {
                                    numPersonelRef = personelCode,
                                    strChildName = arrayInfo2[0].Trim(),
                                    strChildFamily = arrayInfo2[1].Trim(),
                                    strRegisterUserRef = _ofcUser.strUserCode,
                                    dateRegisterDate = _PDate.PersianDate,
                                    strChildMelliCode = arrayInfo2[2].Trim(),
                                    strNumberShenasname = arrayInfo2[3].Trim(),
                                    dateChildBrithDayDate = arrayInfo2[4].Trim(),
                                    numChildKind = Convert.ToInt16(arrayInfo2[5].Trim())
                                });
                            }
                        }
                    }
                    //======================================================================================
                    var UniversitiesCheck = office.ofcPersonelUniversities.Where(c => c.numPersonelRef == personelCode);
                    if (UniversitiesCheck.Count() > 0)
                    {
                        office.ofcPersonelUniversities.DeleteAllOnSubmit(UniversitiesCheck);
                    }

                    string[] arrayUniversityInfo = UniversityInfo.Split(',');
                    foreach (var item in arrayUniversityInfo)
                    {
                        if (item.Trim() != "")
                        {
                            string[] arrayInfo2 = item.Split('^');
                            office.ofcPersonelUniversities.InsertOnSubmit(new ofcPersonelUniversity
                            {
                                numPersonelRef = personelCode,
                                strUniversityName = arrayInfo2[0].Trim(),
                                numUniversitySectionRef = Convert.ToInt16(arrayInfo2[1].Trim()),
                                strUniversityField = arrayInfo2[2].Trim(),
                                strUniversityOrientation = arrayInfo2[3].Trim(),
                                dateStartUniversityDate = arrayInfo2[4].Trim(),
                                dateEndUniversityDate = arrayInfo2[5].Trim(),
                                strUniversityAvg = arrayInfo2[6].Trim(),
                                timeRegisterTime = _PDate.PersianTime,
                                strRegisterUserRef = _ofcUser.strUserCode,
                                dateRegisterDate = _PDate.PersianDate,
                            });
                        }
                    }
                    //======================================================================================
                    var EducationsCheck = office.ofcPersonelEducations.Where(c => c.numPersonelRef == personelCode);
                    if (EducationsCheck.Count() > 0)
                    {
                        office.ofcPersonelEducations.DeleteAllOnSubmit(EducationsCheck);
                    }

                    string[] arrayDoreInfo = DoreInfo.Split(',');
                    foreach (var item in arrayDoreInfo)
                    {
                        if (item.Trim() != "")
                        {
                            string[] arrayInfo2 = item.Split('^');
                            office.ofcPersonelEducations.InsertOnSubmit(new ofcPersonelEducation
                            {
                                numPersonelRef = personelCode,
                                strEducationName = arrayInfo2[0].Trim(),
                                strLessonName = arrayInfo2[1].Trim(),
                                strEducationTime = arrayInfo2[2].Trim(),
                                dateStartLessonDate = arrayInfo2[3].Trim(),
                                dateEndLessonDate = arrayInfo2[4].Trim(),
                                timeRegisterTime = _PDate.PersianTime,
                                strRegisterUserRef = _ofcUser.strUserCode,
                                dateRegisterDate = _PDate.PersianDate,
                                strGovahiNameTitle = arrayInfo2[5].Trim()
                            });
                        }
                    }
                    //======================================================================================
                    var LanguagesCheck = office.ofcPersonelLanguages.Where(c => c.numPersonelRef == personelCode);
                    if (LanguagesCheck.Count() > 0)
                    {
                        office.ofcPersonelLanguages.DeleteAllOnSubmit(LanguagesCheck);
                    }

                    string[] arrayLangugeInfo = LangugeInfo.Split(',');
                    foreach (var item in arrayLangugeInfo)
                    {
                        if (item.Trim() != "")
                        {
                            string[] arrayInfo2 = item.Split('^');
                            office.ofcPersonelLanguages.InsertOnSubmit(new ofcPersonelLanguage
                            {
                                numPersonelRef = personelCode,
                                strLanguageName = arrayInfo2[0].Trim(),
                                numReadingRef = Convert.ToInt16(arrayInfo2[1].Trim()),
                                numWritingRef = Convert.ToInt16(arrayInfo2[2].Trim()),
                                numSpeakingRef = Convert.ToInt16(arrayInfo2[3].Trim()),
                                timeRegisterTime = _PDate.PersianTime,
                                strRegisterUserRef = _ofcUser.strUserCode,
                                dateRegisterDate = _PDate.PersianDate,
                            });
                        }
                    }
                    //======================================================================================
                    var SkillCheck = office.ofcPersonelSkills.Where(c => c.numPersonelRef == personelCode);
                    if (SkillCheck.Count() > 0)
                    {
                        office.ofcPersonelSkills.DeleteAllOnSubmit(SkillCheck);
                    }

                    string[] arrayMaharatInfo = MaharatInfo.Split(',');
                    foreach (var item in arrayMaharatInfo)
                    {
                        if (item.Trim() != "")
                        {
                            string[] arrayInfo2 = item.Split('^');
                            office.ofcPersonelSkills.InsertOnSubmit(new ofcPersonelSkill
                            {
                                numPersonelRef = personelCode,
                                strSkillName = arrayInfo2[0].Trim(),
                                strSkillDesc = arrayInfo2[1].Trim(),
                                timeRegisterTime = _PDate.PersianTime,
                                strRegisterUserRef = _ofcUser.strUserCode,
                                dateRegisterDate = _PDate.PersianDate,
                                numMaharatLevel = Convert.ToInt16(arrayInfo2[2].Trim())
                            });
                        }
                    }
                    //======================================================================================
                    var HistoryJobCheck = office.ofcPersonelHistoryJobs.Where(c => c.numPersonelRef == personelCode);
                    if (HistoryJobCheck.Count() > 0)
                    {
                        office.ofcPersonelHistoryJobs.DeleteAllOnSubmit(HistoryJobCheck);
                    }

                    string[] arrayJobHistoryInfo = JobHistoryInfo.Split(',');
                    foreach (var item in arrayJobHistoryInfo)
                    {
                        if (item.Trim() != "")
                        {
                            string[] arrayInfo2 = item.Split('^');
                            office.ofcPersonelHistoryJobs.InsertOnSubmit(new ofcPersonelHistoryJob
                            {
                                numPersonelRef = personelCode,
                                strJobPlaceName = arrayInfo2[0].Trim(),
                                strResponsibilityName = arrayInfo2[1].Trim(),
                                dateResponsibilityFromDate = arrayInfo2[2].Trim(),
                                dateResponsibilityToDate = arrayInfo2[3].Trim(),
                                strResponsibilityDesc = arrayInfo2[4].Trim(),
                                timeRegisterTime = _PDate.PersianTime,
                                strRegisterUserRef = _ofcUser.strUserCode,
                                dateRegisterDate = _PDate.PersianDate,
                            });
                        }
                    }

                    //======================================================================================
                    string[] filePaths = Directory.GetFiles(context.Server.MapPath(@"\Images\TempPersonelImge\"));
                    string type = "", fileName = "", fileRegister = "";
                    string savepath = HttpContext.Current.Server.MapPath("~/Images/TempPersonelImge/");

                    string savepathMain = HttpContext.Current.Server.MapPath("~/Images/PersonelImge/");

                    foreach (var file in filePaths)
                    {
                        type = Path.GetFileName(file).Split('_')[1];
                        fileRegister = Path.GetFileName(file).Split('_')[0];
                        fileName = Path.GetFileName(file);
                        if (fileRegister.Trim() == _ofcUser.strUserCode.Trim())
                        {
                            office.ofcPersonelFileUploadeds.InsertOnSubmit(new ofcPersonelFileUploaded
                            {
                                numPersonelRef = personelCode,
                                strRegisterUserRef = _ofcUser.strUserCode,
                                dateRegisterDate = _PDate.PersianDate,
                                numFileType = Convert.ToInt16(type),
                                strUploadImage = fileName
                            });

                            if (File.Exists(savepath + fileName))
                            {
                                File.Move(savepath + fileName, savepathMain + fileName);
                                File.Delete(savepath + fileName);
                            }

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
                json = serializer.Serialize((object)"2"); //code melli tekrari
            }
        }
        else
        {
            json = serializer.Serialize((object)"4"); //code personeli yaft nashod
        }

        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //-----------------------------------آپلود مدارک پرسنل----------------------------------
    //---------------------------------------------------------------------
    public void UpFilePersonel()
    {
        string type = context.Request.Form["type"];
        HttpPostedFile postedFile = context.Request.Files["UpFile"];
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        string json = "", fname = "";
        //----------------------------------------------------------SendFile--------------------------------------------------
        //if (type == "1") //akse personeli
        //{
        string savepath = HttpContext.Current.Server.MapPath("~/Images/TempPersonelImge/");
        var extension = Path.GetExtension(postedFile.FileName).ToLower();
        if (extension.Trim().ToLower() == ".jpg" || extension.Trim().ToLower() == ".png" || extension.Trim().ToLower() == ".gif" || extension.Trim().ToLower() == ".gpeg")
        {//fname = postedFile.FileName.Remove((postedFile.FileName.Length - extension.Length));
            string unicode = _ofcUser.strUserCode.Trim() + "_" + type + "_" + _PDate.NowYear + _PDate.NowMonth + _PDate.NowDay + DateTime.Now.Hour.ToString() + DateTime.Now.Minute.ToString() + DateTime.Now.Second.ToString();
            fname = fname + unicode + extension;
            savepath += fname;
            if (!File.Exists(savepath))
            {
                postedFile.SaveAs(savepath);
            }
            else
            {
                File.Delete(savepath);
                postedFile.SaveAs(savepath);
            }

            json = serializer.Serialize((object)"1^" + fname);
        }
        else
        {
            json = serializer.Serialize((object)"2");
        }
        // }
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-------------حذف عکس های آپلود شده در صورت وجود--------------
    //----------------------------------------------------------------------
    private void DeleteFileTemp()
    {
        string[] filePaths = Directory.GetFiles(context.Server.MapPath(@"\Images\TempPersonelImge\"));
        string fileName = "", fileRegister = "";
        string savepath = HttpContext.Current.Server.MapPath("~/Images/TempPersonelImge/");
        foreach (var file in filePaths)
        {
            fileRegister = Path.GetFileName(file).Split('_')[0];
            fileName = Path.GetFileName(file);
            if (fileRegister.Trim() == _ofcUser.strUserCode.Trim())
            {
                if (File.Exists(savepath + fileName))
                {
                    File.Delete(savepath + fileName);
                }
            }
        }
    }
    //----------------------------------------------------------------------
    //-------------دریافت اطلاعات پرسنلی با کد پرسنل--------------
    //----------------------------------------------------------------------
    private void GetInfoPersonelByCode()
    {
        int personelcode = Convert.ToInt32(context.Request.Form["personelcode"]);
        var check = office.ofcPersonels.Where(c => c.numPersonelCode == personelcode && (new int[] { 1, 2 }).Contains((int)c.numStatus)).FirstOrDefault();
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        string json = "";
        if (check != null)
        {
            var personelInfo = (from t in office.ofcPersonels
                                where t.numPersonelCode == personelcode
                                select new
                                {
                                    t.strPersonelName,
                                    t.strPersonelFamily,
                                    t.strFatherName,
                                    t.strPersonalPass,
                                    t.strMelliCode,
                                    t.strNumberShenasname,
                                    t.strMosalsalShenasname,
                                    t.dateBrithdayDate,
                                    t.strBrithdayCityRef,
                                    t.strExportCityRef,
                                    t.numMeliat,
                                    t.numJensiatRef,
                                    t.numMilitaryRef,
                                    t.numReligionRef,
                                    t.strGilderName,
                                    t.numBlodRef,
                                    t.numMarridRef,
                                    t.strProvinceRef,
                                    t.strCityRef,
                                    t.numHosingRef,
                                    t.strPersonelAddress,
                                    t.strPostCode,
                                    t.strTel,
                                    t.strMobile,
                                    t.strTelNecessary,
                                    t.strEmail,
                                });

            var childinfo = (from t in office.ofcPersonelChildInfos
                             where t.numPersonelRef == personelcode
                             select new
                             {
                                 t.dateChildBrithDayDate,
                                 t.strChildFamily,
                                 t.strChildMelliCode,
                                 t.strChildName,
                                 t.strNumberShenasname,
                                 t.numChildKind,
                             });

            var marridinfo = (from t in office.ofcPersonelMarridInfos
                              where t.numPersonelRef == personelcode
                              select new
                              {
                                  t.strNumberShenasname,
                                  t.strPersonFamily,
                                  t.strPersonMelliCode,
                                  t.strPersonName,
                                  t.dateMarridBrithdayDate,
                                  t.dateMarridDate
                              });
            var Universityinfo = (from t in office.ofcPersonelUniversities
                                  where t.numPersonelRef == personelcode
                                  select new
                                  {
                                      t.strUniversityAvg,
                                      t.strUniversityField,
                                      t.strUniversityName,
                                      t.strUniversityOrientation,
                                      t.numUniversitySectionRef,
                                      t.dateEndUniversityDate,
                                      t.dateStartUniversityDate
                                  });
            var Doreinfo = (from t in office.ofcPersonelEducations
                            where t.numPersonelRef == personelcode
                            select new
                            {
                                t.dateEndLessonDate,
                                t.dateStartLessonDate,
                                t.strEducationName,
                                t.strEducationTime,
                                t.strLessonName,
                                t.strGovahiNameTitle
                            });
            var Langugeinfo = (from t in office.ofcPersonelLanguages
                               where t.numPersonelRef == personelcode
                               select new
                               {
                                   t.strLanguageName,
                                   t.numReadingRef,
                                   t.numSpeakingRef,
                                   t.numWritingRef
                               });
            var Maharatinfo = (from t in office.ofcPersonelSkills
                               where t.numPersonelRef == personelcode
                               select new
                               {
                                   t.strSkillDesc,
                                   t.strSkillName,
                                   t.numMaharatLevel
                               });
            var JobHistoryinfo = (from t in office.ofcPersonelHistoryJobs
                                  where t.numPersonelRef == personelcode
                                  select new
                                  {
                                      t.strJobPlaceName,
                                      t.strResponsibilityDesc,
                                      t.strResponsibilityName,
                                      t.dateResponsibilityFromDate,
                                      t.dateResponsibilityToDate
                                  });

            var FileUpinfo = (from t in office.ofcPersonelFileUploadeds
                              where t.numPersonelRef == personelcode
                              &&
                              (new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9 }).Contains((int)t.numFileType)
                              select new
                              {
                                  t.strUploadImage,
                                  t.numFileType,
                              });

            string json0 = serializer.Serialize((object)personelInfo);
            string json1 = serializer.Serialize((object)"1");
            string json2 = serializer.Serialize((object)childinfo);
            string json3 = serializer.Serialize((object)marridinfo);
            string json4 = serializer.Serialize((object)Universityinfo);
            string json5 = serializer.Serialize((object)Doreinfo);
            string json6 = serializer.Serialize((object)Langugeinfo);
            string json7 = serializer.Serialize((object)Maharatinfo);
            string json8 = serializer.Serialize((object)JobHistoryinfo);
            // string json9 = serializer.Serialize((object)bimeh);
            string json10 = serializer.Serialize((object)FileUpinfo);

            json = "[" + json1 + "," + json0 + "," + json2 + "," + json3 + "," + json4 + "," + json5 + "," + json6 + "," + json7 + "," + json8 + "," + json10 + "]";
        }
        else
        {
            json = serializer.Serialize((object)"2");
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
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string DateFrom = context.Request.Form["DateFrom"];
        string DateTo = context.Request.Form["DateTo"];
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        var personel = (from t in office.ofcPersonels
                        join t1 in office.ofcBMarrids on t.numMarridRef equals t1.numMarridCode
                        join t2 in office.ofcBReligions on t.numReligionRef equals t2.numReligionCode
                        where
                             (t.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                             &&
                            ((t.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            (t.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            name == "")
                            &&
                            (t.strMelliCode == mellicode || mellicode == "")
                            &&
                            (string.Compare(t.dateRegisterDate, DateFrom) >= 0 && string.Compare(t.dateRegisterDate, DateTo) <= 0)
                            &&
                            t.numStatus == 2
                        select new
                        {
                            PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                            t.numPersonelCode,
                            t.strFatherName,
                            t.strMelliCode,
                            t.strNumberShenasname,
                            t.dateBrithdayDate,
                            t.dateRegisterDate,
                            t2.strReligionName,
                            t.strGilderName,
                            t1.strMarridName
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