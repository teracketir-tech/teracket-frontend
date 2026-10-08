using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for FuncAllEdari
/// </summary>
public class FuncAllEdari
{
    ofcUser _ofcUser;
    Function func = new Function();
    OfficeDataContext office;
    PersianDateTime _PDate = new PersianDateTime(0);
    int hoghoghSabet = 0;
    int BimehProjectAndSaati = 0; // 9421645; // hoghogh sabet + bon + hagh maskan sale  95
    h8.h8 _h8 = new h8.h8();
    public FuncAllEdari()
    {
        BimehProjectAndSaati = func.BimehProjectAndSaati;
        hoghoghSabet = func.hoghoghSabet;
        office = new OfficeDataContext(func.Officecstr.Trim());
    }

    //----------------------------------------------------------------------
    //----------------------چک کردن خالی بودن فیلد -------------------
    //----------------------------------------------------------------------
    public int CheckIsNUll(int items, int value)
    {
        int ret = 0;
        ret = items == null ? value : items;
        return ret;
    }
    //----------------------------------------------------------------------
    public int CheckIsNUll(int? items, int value)
    {
        int? ret = 0;
        ret = items == null ? value : items;
        return Convert.ToInt32(ret);
    }
    //----------------------------------------------------------------------
    public string CheckIsNUll(string items, string value)
    {
        string ret = "0";
        ret = String.IsNullOrEmpty(items) ? value : items.Trim();
        return ret;
    }
    //----------------------------------------------------------------------
    //---------------------------------محاسبه بیمه-------------------------
    //----------------------------------------------------------------------
    public int GetPriceKarkardBimeh(int personelcode, int price, int year, int month, int ContractKindRef, string datecutwork, string dateStartContract)
    {
        int ret = 0;
        int dayCountInMonth = 30; //default
        int dayKarkard = 0;
        int CntkBimeMaheGhabl = 1;
        double PriceKol = 0;
        var checkBimeh = office.ofcPersonelBimehs.Where(c => c.numPersonelRef == personelcode && c.numStatus == 2 && (c.dateEndBimehDate == "" || c.dateEndBimehDate == null)).FirstOrDefault();
        if (checkBimeh != null)
        {
            string[] arrayDateStart = checkBimeh.dateStartBimehDate.Split('/');
            int yearBimeh = Convert.ToInt32(arrayDateStart[0]);
            int monthBImeh = Convert.ToInt32(arrayDateStart[1]);
            int dayBimeh = Convert.ToInt32(arrayDateStart[2]);

            if (Convert.ToInt32(arrayDateStart[0]) == year && Convert.ToInt32(arrayDateStart[1]) == month)
            {
                CntkBimeMaheGhabl = 1;
            }
            else
            {
                if (ContractKindRef == 1 || ContractKindRef == 3)
                {
                    var checkPreInvoice2 = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == personelcode && (new int[] { 1, 2, 0 }).Contains((int)c.numStatus)).OrderByDescending(c => c.numInvoiceCode).Take(3);
                    if (Convert.ToInt32(checkPreInvoice2.Sum(c => c.numPricePersonelBimeh)) > 0)
                    {
                        CntkBimeMaheGhabl = 1; // yek mah bimeh kam beshe
                    }
                    else
                    {
                        CntkBimeMaheGhabl = 2; // baiad 2 mah bime kam beshe
                    }

                }
                else if (ContractKindRef == 2)
                {
                    var checkPreInvoice2 = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numPersonelRef == personelcode && (new int[] { 1, 2, 0 }).Contains((int)c.numStatus)).OrderByDescending(c => c.numInvoiceSaatiCode).Take(3);
                    if (Convert.ToInt32(checkPreInvoice2.Sum(c => c.numPricePersonelBimeh)) > 0)
                    {
                        CntkBimeMaheGhabl = 1; // yek mah bimeh kam beshe
                    }
                    else
                    {
                        CntkBimeMaheGhabl = 2; // baiad 2 mah bime kam beshe
                    }
                }

            }

            if (CntkBimeMaheGhabl == 2)
            {
                int monthcount = 0;
                //===============================mahaie pish====================================================
                if (year == yearBimeh)
                {
                    var dayInMonthBefore = office.ofcDayWorkIntoMonths.Where(t => (t.numMonthJob >= monthBImeh && t.numMonthJob <= month) && t.numYear == yearBimeh);
                    if (dayInMonthBefore.Count() == 0)
                        dayCountInMonth = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == month && c.numYear == year).FirstOrDefault().numCountDay);// faghat yek mah mohasebe shavad
                    else
                        dayCountInMonth = Convert.ToInt32(dayInMonthBefore.Sum(c => c.numCountDay));

                    monthcount = dayInMonthBefore.Count();

                }
                else if (year != yearBimeh)
                {
                    //==================================majmoe roze kari parsal ===========================
                    var dayInMonthBefore = office.ofcDayWorkIntoMonths.Where(t => (t.numMonthJob >= monthBImeh && t.numMonthJob <= 12) && t.numYear == yearBimeh);
                    if (dayInMonthBefore.Count() == 0)
                        dayCountInMonth = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == month && c.numYear == year).FirstOrDefault().numCountDay);// faghat yek mah mohasebe shavad
                    else
                        dayCountInMonth = Convert.ToInt32(dayInMonthBefore.Sum(c => c.numCountDay));

                    monthcount = dayInMonthBefore.Count();

                    //====================================majmoe roze kari emsal=========================
                    var dayInMonthBefore2 = office.ofcDayWorkIntoMonths.Where(t => (t.numMonthJob >= 1 && t.numMonthJob <= month) && t.numYear == year);
                    if (dayInMonthBefore2.Count() == 0)
                        dayCountInMonth = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == month && c.numYear == year).FirstOrDefault().numCountDay); // faghat yek mah mohasebe shavad
                    else
                        dayCountInMonth = dayCountInMonth + Convert.ToInt32(dayInMonthBefore2.Sum(c => c.numCountDay));

                    monthcount = monthcount + dayInMonthBefore2.Count();

                }

                dayKarkard = (dayCountInMonth - dayBimeh) + 1;

                //======================================= mablagh be ezaie yek mahe az tarikhe shoro gharardad ================================
                // int cntdate = Convert.ToInt32(office.CountdateBetweenDate(checkBimeh.dateStartBimehDate.Trim(), datecutwork.Trim()));
                // double PriceKolsum = ((Convert.ToDouble(price) / Convert.ToDouble(30)) * Convert.ToDouble(cntdate)) / monthcount;
                // price = Convert.ToInt32(Math.Round(PriceKolsum));
                //=======================================
                // dayCountInMonth = 30;
                // PriceKol = ((Convert.ToDouble(price) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard)) * monthcount;
                var contract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == personelcode && c.numStatus == 1).FirstOrDefault();
                if (contract != null)
                {
                    price = contract.numContractKindRef == 3 ? BimehProjectAndSaati : Convert.ToInt32(contract.numPersonelSalary + contract.numPersonelHomeSalary + contract.numPersonelBon);
                    dayCountInMonth = 30;
                    PriceKol = (Convert.ToDouble(price) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard);
                }
                else
                    PriceKol = 0;

            }
            else
            {
                //var dayInMonth = (from t in office.ofcDayWorkIntoMonths
                //                  where
                //                       t.numMonthJob == month
                //                       &&
                //                       t.numYear == year
                //                  select new
                //                  {
                //                      t.numCountDay
                //                  }).FirstOrDefault();

                //if (dayInMonth != null) dayCountInMonth = Convert.ToInt32(dayInMonth.numCountDay);
                ////======================================= mablagh be ezaie yek mahe az tarikhe shoro gharardad ================================
                //string[] arrayDateStartcontract = dateStartContract.Split('/');

                //if (Convert.ToInt32(arrayDateStartcontract[0]) == year && Convert.ToInt32(arrayDateStartcontract[1]) == month)
                //    dayKarkard = (dayCountInMonth - Convert.ToInt32(arrayDateStartcontract[2])) + 1;
                //else
                //    dayKarkard = (dayCountInMonth - 1) + 1;


                //double PriceKolsum = (Convert.ToDouble(price) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard);
                //price = Convert.ToInt32(Math.Round(PriceKolsum));
                ////=======================================

                //if (Convert.ToInt32(arrayDateStart[0]) == year && Convert.ToInt32(arrayDateStart[1]) == month)
                //    dayKarkard = (dayCountInMonth - Convert.ToInt32(arrayDateStart[2])) + 1;
                //else
                //    dayKarkard = (dayCountInMonth - 1) + 1;

                //PriceKol = (Convert.ToDouble(price) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard);
                PriceKol = Convert.ToDouble(price);
            }
            //double b = Convert.ToDouble(price) / Convert.ToDouble(dayCountInMonth);
            ret = Convert.ToInt32(Math.Round(PriceKol));
        }

        return ret;
    }
    //---------------------------------------------------------------------
    //---------------------------------محاسبه  مبلغ کارکرد----------------
    //---------------------------------------------------------------------
    public int Getkarkard(int personelcode, string karkard, int? price1, int type, int contractcode, int iscutwork)
    {
        int result = 0;
        if (price1 > 0)
        {
            if (iscutwork == 1)
                karkard = GetTimeKarkard(personelcode, "", "", 0, contractcode, type, 2);
            int price = Convert.ToInt32(price1);
            double mozd1 = Math.Round(((price / 30) / 7.33) * 1.4);
            double mozd2 = Math.Round(((price / 30) / 7.33) * 1.8);

            if (type == 1 || type == 11 || type == 12) // ezafekar and ezafe kar vijeh
                result = Convert.ToInt32((Convert.ToDouble(karkard.Split(':')[0]) * mozd1) + ((Convert.ToDouble(karkard.Split(':')[1]) / 60) * mozd1));
            else if (type == 2) //jomekar
                result = Convert.ToInt32((Convert.ToDouble(karkard.Split(':')[0]) * mozd2) + ((Convert.ToDouble(karkard.Split(':')[1]) / 60) * mozd2));
            else if (type == 3) //tatilkar
                result = Convert.ToInt32((Convert.ToDouble(karkard.Split(':')[0]) * mozd1) + ((Convert.ToDouble(karkard.Split(':')[1]) / 60) * mozd1));
            else if (type == 4) //mamoriat
                result = Convert.ToInt32(Convert.ToDouble(karkard) * Convert.ToDouble(price / 30));
            else if (type == 5) //takhir
                result = Convert.ToInt32((Convert.ToDouble(karkard.Split(':')[0]) * mozd1) + ((Convert.ToDouble(karkard.Split(':')[1]) / 60) * mozd1));
            else if (type == 6) //tajil
                result = Convert.ToInt32((Convert.ToDouble(karkard.Split(':')[0]) * mozd1) + ((Convert.ToDouble(karkard.Split(':')[1]) / 60) * mozd1));
            else if (type == 7) //ghibat
                result = Convert.ToInt32(Convert.ToDouble(karkard) * Convert.ToDouble((price / 30) * 2));
            else if (type == 8) //khorojghiremojaz
                result = Convert.ToInt32((Convert.ToDouble(karkard.Split(':')[0]) * mozd1) + ((Convert.ToDouble(karkard.Split(':')[1]) / 60) * mozd1));
        }
        return result;
    }
    //---------------------------------------------------------------------
    //-------------------------محاسبه مبلغ فرآیند------------------------
    //---------------------------------------------------------------------
    public int GetPriceFaraind(int personelcode, int year, int month, int pricefaraiand)
    {
        int ret = 0;
        var check = office.ofcPersonelFaraiands.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0 && c.numMonthJob == month && c.numYear == year);
        if (check.Any())
        {
            ret = Convert.ToInt32(check.Sum(c => c.numCountFaraiandProject)) * pricefaraiand;
        }
        return ret;
    }
    //---------------------------------------------------------------------
    //--------------------محاسبه مانده حقوق از ماه قبل-------------------
    //---------------------------------------------------------------------
    public string GetMandeHoghoghAzMaheGhabl(int personelcode, int year, int month, string dateCutWork, int type, int isCutwork)
    {
        string ret = "";
        //if (isCutwork == 0)
        //{
        if (month == 1)
        {
            month = 12;
            year = year - 1;
        }
        else
        {
            month = month - 1;
        }
        // }
        //===========================================================================
        int?[] numPeronelKarkard = { };
        var checkPreInvoice = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month.ToString() && c.strInvoiceYear == year.ToString() && (new int[] { 1, 2, 0 }).Contains((int)c.numStatus)).OrderByDescending(c => c.numInvoiceCode).FirstOrDefault();
        if (checkPreInvoice != null)
        {
            if ((checkPreInvoice.numStatus == 1 || checkPreInvoice.numStatus == 2))
            {
                if (isCutwork == 0)
                {
                    numPeronelKarkard = (from t8 in office.ofcPersonelMonthlyJobs
                                         where
                                              (new int[] { 0, 1 }).Contains((int)t8.numStatus)
                                              &&
                                              t8.numMonthJob == month
                                              &&
                                              t8.numYear == year
                                              &&
                                              t8.numPersonelRef == personelcode
                                         select t8.numPersonelRef).ToArray();
                }
                else if (isCutwork == 1 && Convert.ToInt32(checkPreInvoice.strInvoiceMonth) == month && Convert.ToInt32(checkPreInvoice.strInvoiceYear) == year)
                {
                    List<int?> lst = new List<int?>();
                    lst.Add(personelcode);
                    numPeronelKarkard = lst.ToArray();
                }
            }
            else if (checkPreInvoice.numStatus == 0)
            {
                List<int?> lst = new List<int?>();
                lst.Add(personelcode);
                numPeronelKarkard = lst.ToArray();
            }
        }
        //===========================================================================
        int?[] numPeronelKarkardSaati = { };
        var checkPreInvoicesaati = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month.ToString() && c.strInvoiceYear == year.ToString() && (new int[] { 1, 2, 0 }).Contains((int)c.numStatus)).OrderByDescending(c => c.numInvoiceSaatiCode).FirstOrDefault();
        if (checkPreInvoicesaati != null)
        {
            if (checkPreInvoicesaati.numStatus == 1 || checkPreInvoicesaati.numStatus == 2)
            {
                if (isCutwork == 0)
                {
                    numPeronelKarkardSaati = (from t8 in office.ofcPersonelMonthlyJobSaatis
                                              where
                                                   (new int[] { 0, 1 }).Contains((int)t8.numStatus)
                                                   &&
                                                   t8.numMonthJob == month
                                                   &&
                                                   t8.numYear == year
                                                   &&
                                                   t8.numPersonelRef == personelcode
                                              select t8.numPersonelRef).ToArray();
                }
                else if (isCutwork == 1 && Convert.ToInt32(checkPreInvoice.strInvoiceMonth) == month && Convert.ToInt32(checkPreInvoice.strInvoiceYear) == year)
                {
                    List<int?> lst = new List<int?>();
                    lst.Add(personelcode);
                    numPeronelKarkardSaati = lst.ToArray();
                }
            }
            else if (checkPreInvoicesaati.numStatus == 0)
            {
                List<int?> lst = new List<int?>();
                lst.Add(personelcode);
                numPeronelKarkardSaati = lst.ToArray();
            }
        }
        //===========================================================================
        string DateFrom = year.ToString() + "/" + (month.ToString().Length == 1 ? "0" + month.ToString() : month.ToString()) + "/31";
        var PersonelCheck = (from t in office.ofcPersonels
                             join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                             where
                                  (t.numPersonelCode == personelcode)
                                  &&
                                  t1.numStatus == 1
                                  &&
                                  (t.numStatus == 2 || t.numStatus == 1)
                                  &&
                                  !
                                  (numPeronelKarkard).Contains(t.numPersonelCode)
                                  &&
                                  !
                                  (numPeronelKarkardSaati).Contains(t.numPersonelCode)
                                  &&
                                 string.Compare(t1.dateStartContractDate, DateFrom) <= 0
                             select new
                             {
                                 t.numPersonelCode,
                                 t1.dateStartContractDate,
                                 t1.numPersonelSalary,
                                 t1.numPersonelSanavat,
                                 t1.numPersonelHomeSalary,
                                 t1.numPersonelBon,
                                 t1.numPersonelPadash,
                                 t1.numContractKindRef,
                                 t1.numPersonelChildSalary,
                                 t1.numPriceAyabZahab,
                                 t1.numPriceHaghModiriat,
                                 //t1.dateCutWorkDate
                             }).FirstOrDefault();
        //======================================== mohasebe ===========
        if (PersonelCheck != null)
        {
            int dayCountInMonth = 30; //default
            int dayKarkard = 0;
            //int CntkHoghoghMaheGhabl = 1;
            double PriceHoghogh = 0, PriceHomsalary = 0, PriceBon = 0,
                   PricePadash = 0, PriceSanavat = 0, PriceOlad = 0, Pricemah31roz = 0,
                   PriceAyabzahab = 0, Pricehaghmodiriat = 0,
                   padash = 0, jarimeMotefareghe = 0, Moavaghe = 0, kharid = 0, kosormotefareghe = 0,
                   mah29roz = 0, bimehKarmand = 0, maliathoghogh = 0, bimetakmili = 0,
                   priceVamMontly = 0, PriceMosaede = 0;

            string[] arrayDateStart = PersonelCheck.dateStartContractDate.Split('/');

            if (Convert.ToInt32(arrayDateStart[0]) == year && Convert.ToInt32(arrayDateStart[1]) == month)
            {
                //===============================mahe pish====================================================
                //dayKarkard = (dayCountInMonth - Convert.ToInt32(arrayDateStart[2])) + 1;
                dayKarkard = (20 - Convert.ToInt32(arrayDateStart[2])) + 1;
            }
            else
            {
                dayKarkard = (dayCountInMonth - 1) + 1;
            }

            PriceHoghogh = (Convert.ToDouble(PersonelCheck.numPersonelSalary) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard);
            PriceHomsalary = (Convert.ToDouble(PersonelCheck.numPersonelHomeSalary) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard);
            PriceBon = (Convert.ToDouble(PersonelCheck.numPersonelBon) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard);
            PricePadash = PersonelCheck.numContractKindRef == 3 ? 0 : (Convert.ToDouble(PersonelCheck.numPersonelPadash) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard);
            PriceSanavat = (Convert.ToDouble(PersonelCheck.numPersonelSanavat) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard);
            PriceOlad = (Convert.ToDouble(PersonelCheck.numPersonelChildSalary) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard);

            PriceAyabzahab = (Convert.ToDouble(PersonelCheck.numPriceAyabZahab) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard);
            Pricehaghmodiriat = (Convert.ToDouble(PersonelCheck.numPriceHaghModiriat) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard);
            Pricemah31roz = Convert.ToDouble(GetPriceMonth29Or31(personelcode, Convert.ToInt32(PersonelCheck.numPersonelSalary), year, month, PersonelCheck.dateStartContractDate, dateCutWork, (int)PersonelCheck.numContractKindRef, 0, 1));

            padash = Convert.ToDouble(GetPadashAndJarimeh(personelcode, 1, Convert.ToInt32(month), Convert.ToInt32(year), 0));
            Moavaghe = Convert.ToDouble(GetPadashAndJarimeh(personelcode, 3, Convert.ToInt32(month), Convert.ToInt32(year), 0));

            //========================================kosor=================================================
            jarimeMotefareghe = Convert.ToDouble(GetPadashAndJarimeh(personelcode, 2, Convert.ToInt32(month), Convert.ToInt32(year), 0));
            kharid = Convert.ToDouble(GetPadashAndJarimeh(personelcode, 4, Convert.ToInt32(month), Convert.ToInt32(year), 0));
            kosormotefareghe = Convert.ToDouble(GetPadashAndJarimeh(personelcode, 5, Convert.ToInt32(month), Convert.ToInt32(year), 0));

            mah29roz = Convert.ToDouble(GetPriceMonth29Or31(personelcode, Convert.ToInt32(PersonelCheck.numPersonelSalary), year, month, PersonelCheck.dateStartContractDate, dateCutWork, (int)PersonelCheck.numContractKindRef, 0, 2));


            var checkBimeh = office.ofcPersonelBimehs.Where(c => c.numPersonelRef == personelcode && c.numStatus == 2 && (c.dateEndBimehDate == "" || c.dateEndBimehDate == null)).FirstOrDefault();
            if (checkBimeh != null)
            {
                string[] arrayDateBimeh = checkBimeh.dateStartBimehDate.Split('/');
                int yearBimeh = Convert.ToInt32(arrayDateStart[0]);
                int monthBImeh = Convert.ToInt32(arrayDateStart[1]);
                int dayBimeh = Convert.ToInt32(arrayDateStart[2]);

                if (Convert.ToInt32(arrayDateStart[0]) == year && Convert.ToInt32(arrayDateStart[1]) == month)
                {
                    bimehKarmand = 0;
                }
                else
                {
                    if (isCutwork == 0)
                        bimehKarmand = Convert.ToDouble(GetPriceKarkardBimeh(personelcode, (PersonelCheck.numContractKindRef == 3 ? GetPriceKarkardCutWork((int)BimehProjectAndSaati, PersonelCheck.dateStartContractDate, dateCutWork, Convert.ToInt32(year), Convert.ToInt32(month), (int)PersonelCheck.numContractKindRef, personelcode, 2) : (int)GetPriceKarkardCutWork((int)(PersonelCheck.numPersonelSalary + PersonelCheck.numPersonelHomeSalary + PersonelCheck.numPersonelBon), PersonelCheck.dateStartContractDate, dateCutWork, Convert.ToInt32(year), Convert.ToInt32(month), (int)PersonelCheck.numContractKindRef, personelcode, 2)), year, month, (int)PersonelCheck.numContractKindRef, dateCutWork, PersonelCheck.dateStartContractDate));
                    else
                        bimehKarmand = Convert.ToDouble(GetPriceKarkardBimeh2(personelcode, (PersonelCheck.numContractKindRef == 3 ? GetPriceKarkardCutWork((int)BimehProjectAndSaati, PersonelCheck.dateStartContractDate, dateCutWork, Convert.ToInt32(year), Convert.ToInt32(month), (int)PersonelCheck.numContractKindRef, personelcode, 2) : (int)GetPriceKarkardCutWork((int)(PersonelCheck.numPersonelSalary + PersonelCheck.numPersonelHomeSalary + PersonelCheck.numPersonelBon), PersonelCheck.dateStartContractDate, dateCutWork, Convert.ToInt32(year), Convert.ToInt32(month), (int)PersonelCheck.numContractKindRef, personelcode, 2)), PersonelCheck.dateStartContractDate, dateCutWork, Convert.ToInt32(year), Convert.ToInt32(month), (int)PersonelCheck.numContractKindRef, 2));
                }
            }


            int bimeh = Convert.ToInt32(Math.Round(bimehKarmand));
            bimehKarmand = (Convert.ToDouble(bimeh) * Convert.ToDouble(0.07)) * Convert.ToDouble(1.1);

            maliathoghogh = Convert.ToDouble(0);
            bimetakmili = Convert.ToDouble(0);

            priceVamMontly = Convert.ToDouble(GetPriceVam(personelcode, Convert.ToInt32(year), Convert.ToInt32(month), 1));
            PriceMosaede = Convert.ToDouble(GetPriceMosaede(personelcode, Convert.ToInt32(year), Convert.ToInt32(month)));

            //====================================return===============================================

            if (type == 1) // calc and show
            {
                ret = ((Convert.ToInt32(Math.Round(PriceHoghogh)) +
                       Convert.ToInt32(Math.Round(PriceHomsalary)) +
                       Convert.ToInt32(Math.Round(PriceBon)) +
                       Convert.ToInt32(Math.Round(PricePadash)) +
                       Convert.ToInt32(Math.Round(PriceOlad)) +
                       Convert.ToInt32(Math.Round(PriceSanavat)) +
                       Convert.ToInt32(Math.Round(PriceAyabzahab)) +
                       Convert.ToInt32(Math.Round(Pricehaghmodiriat)) +
                       Convert.ToInt32(Math.Round(Pricemah31roz)) +
                       Convert.ToInt32(Math.Round(padash)) +
                       Convert.ToInt32(Math.Round(Moavaghe)))
                       -
                       (Convert.ToInt32(Math.Round(jarimeMotefareghe)) +
                       Convert.ToInt32(Math.Round(kharid)) +
                       Convert.ToInt32(Math.Round(kosormotefareghe)) +
                       Convert.ToInt32(Math.Round(mah29roz)) +
                       Convert.ToInt32(Math.Round(maliathoghogh)) +
                       Convert.ToInt32(Math.Round(bimetakmili)) +
                       Convert.ToInt32(Math.Round(bimehKarmand)) +
                       Convert.ToInt32(Math.Round(priceVamMontly)) +
                       Convert.ToInt32(Math.Round(PriceMosaede))
                       )).ToString();
            }
            else if (type == 2) // save to database
            {
                ret = Convert.ToInt32(Math.Round(PriceHoghogh)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(PriceHomsalary)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(PriceBon)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(PricePadash)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(PriceSanavat)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(PriceOlad)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(Pricemah31roz)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(Pricehaghmodiriat)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(PriceAyabzahab)).ToString() + "-" +

                      Convert.ToInt32(Math.Round(padash)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(Moavaghe)).ToString() + "-" +

                      Convert.ToInt32(Math.Round(jarimeMotefareghe)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(kharid)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(kosormotefareghe)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(mah29roz)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(maliathoghogh)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(bimetakmili)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(bimehKarmand)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(priceVamMontly)).ToString() + "-" +
                      Convert.ToInt32(Math.Round(PriceMosaede)).ToString();


            }
        }
        else
        {
            ret = "0";
        }

        return ret;
    }
    //---------------------------------------------------------------------
    //-----------------دریافت مبلغ وام/کد وام----------------------------
    //---------------------------------------------------------------------
    public int GetPriceVam(int personelcode, int year, int month, int type)
    {
        int ret = 0;
        var checkvam = office.ofcPersonelVams.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).FirstOrDefault();
        if (checkvam != null)
        {
            if (type == 1) // mablagh
                ret = Convert.ToInt32(checkvam.numPriceVamMontly);
            else if (type == 2) // code
                ret = checkvam.numVamCode;
        }
        return ret;
    }
    //---------------------------------------------------------------------
    //-----------------------------دریافت مبلغ مساعده---------------------
    //---------------------------------------------------------------------
    public int GetPriceMosaede(int personelcode, int year, int month)
    {
        int ret = 0;
        var checkmosaede = office.ofcPersonelMosaedes.Where(c => c.numPersonelRef == personelcode && c.numMonth == month && c.numYear == year && c.numStatus == 0);
        if (checkmosaede.Any())
        {
            ret = Convert.ToInt32(checkmosaede.Sum(c => c.numPriceMosaede));
        }
        return ret;
    }
    //---------------------------------------------------------------------
    //--------------------------------دریافت کد مساعده--------------------
    //---------------------------------------------------------------------
    public string GetPriceMosaedeCode(int personelcode, int year, int month)
    {
        string ret = "0";
        var checkmosaede = office.ofcPersonelMosaedes.Where(c => c.numPersonelRef == personelcode && c.numMonth == month && c.numYear == year && c.numStatus == 0);
        if (checkmosaede.Any())
        {
            if (checkmosaede.Count() == 1)
            {
                ret = checkmosaede.FirstOrDefault().numMosaedeCode.ToString();
            }
            else
            {
                foreach (var item in checkmosaede)
                    ret = ret + item.numMosaedeCode.ToString() + ",";
            }
        }
        return ret;
    }
    //---------------------------------------------------------------------
    //-------------------------محاسبه  مبلغ کارکرد ساعتی-----------------
    //---------------------------------------------------------------------
    public int GetPriceKarkardSaati(string karkard, int price, int type)
    {
        int result = 0;
        if (type == 1) // time saati
            result = Convert.ToInt32((Convert.ToDouble(karkard.Split(':')[0]) * price) + ((Convert.ToDouble(karkard.Split(':')[1]) / 60) * price));

        return result;
    }
    //----------------------------------------------------------------------
    //-----------------------محاسبه مبلغ حقوق در یک ماه-------------------
    //----------------------------------------------------------------------
    public int GetPriceKarkard(int price, string datestart, int year, int month, string dateEnd, int iscutwork, int personelcode)
    {
        int ret = 0;
        int dayCountInMonth = 30; //default
        int dayKarkard = 0;
        if (!String.IsNullOrEmpty(datestart))
        {
            string[] arrayDateStart = datestart.Split('/');
            if (Convert.ToInt32(arrayDateStart[0]) == year && Convert.ToInt32(arrayDateStart[1]) == month)
            {
                if (iscutwork == 0)
                    dayKarkard = (20 - Convert.ToInt32(arrayDateStart[2])) + 1;
                // dayKarkard =  (20 - Convert.ToInt32(arrayDateStart[2])) + 1;
                //dayKarkard =  (dayCountInMonth - Convert.ToInt32(arrayDateStart[2])) + 1;

                else if (iscutwork == 2) //bimeh
                {
                    int rozmah = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == month && c.numYear == year).FirstOrDefault().numCountDay);
                    if (dateEnd != "" && Convert.ToInt32(dateEnd.Split('/')[0]) == year && Convert.ToInt32(dateEnd.Split('/')[1]) == month)
                        dayKarkard = (Convert.ToInt32(dateEnd.Split('/')[2]) - Convert.ToInt32(arrayDateStart[2])) + 1;
                    else
                    {
                        dayKarkard = (rozmah - Convert.ToInt32(arrayDateStart[2])) + 1;
                    }
                    dayCountInMonth = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == month && c.numYear == year).FirstOrDefault().numCountDay);
                }
                else
                {
                    if (dateEnd != "" && Convert.ToInt32(dateEnd.Split('/')[0]) == year && Convert.ToInt32(dateEnd.Split('/')[1]) == month)
                        dayKarkard = (Convert.ToInt32(dateEnd.Split('/')[2]) - Convert.ToInt32(arrayDateStart[2])) + 1;
                    else
                        dayKarkard = (dayCountInMonth - Convert.ToInt32(arrayDateStart[2])) + 1;

                }
            }
            else
            {
                if (iscutwork == 0)
                    dayKarkard = (dayCountInMonth - 1) + 1;
                //dayKarkard = year == 1400 && month == 1 ? 20 : (dayCountInMonth - 1) + 1;
                else if (iscutwork == 2) //bimeh
                {
                    int rozmah = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == month && c.numYear == year).FirstOrDefault().numCountDay);
                    if (dateEnd != "" && Convert.ToInt32(dateEnd.Split('/')[0]) == year && Convert.ToInt32(dateEnd.Split('/')[1]) == month)
                        dayKarkard = (Convert.ToInt32(dateEnd.Split('/')[2]) - 1) + 1;
                    else
                    {
                        dayKarkard = (rozmah - 1) + 1;
                    }
                    dayCountInMonth = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == month && c.numYear == year).FirstOrDefault().numCountDay);
                }
                else
                {
                    int rozmah = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == month && c.numYear == year).FirstOrDefault().numCountDay);
                    dayKarkard = Convert.ToInt32(dateEnd.Split('/')[2]);
                    dayKarkard = (rozmah == 31 && dayKarkard == 31) || (rozmah == 29 && dayKarkard == 29) ? 30 : dayKarkard;
                }

            }

            double PriceKol = (Convert.ToDouble(price) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard);

            ret = Convert.ToInt32(Math.Round(PriceKol));
        }

        return ret;
    }
    //----------------------------------------------------------------------
    //----------------------------محاسبه پاداش یا جریمه ------------------
    //----------------------------------------------------------------------
    public int GetPadashAndJarimeh(int personelcode, int savekind, int month, int year, int isShowonly)
    {
        int ret = 0;
        var check = office.ofcPersonelPadashAndJarimehs.Where(c => c.numPersonelRef == personelcode && c.numMonth == month && c.numYear == year && c.numSaveKind == Convert.ToInt16(savekind) && ((isShowonly == 0 && c.numStatus == 0) || isShowonly == 1));

        if (check.Any())
        {
            ret = Convert.ToInt32(check.Sum(c => c.numPricePadashAndJarimeh));
        }
        else
        {
            ret = 0;
        }

        return ret;
    }
    //----------------------------------------------------------------------
    //---------------------------دریافت کد پاداش یا جریمه-----------------
    //----------------------------------------------------------------------
    public string GetPadashAndJarimehCode(int personelcode, int savekind, int month, int year)
    {
        string ret = "";
        var check = office.ofcPersonelPadashAndJarimehs.Where(c => c.numPersonelRef == personelcode && c.numMonth == month && c.numYear == year && c.numSaveKind == Convert.ToInt16(savekind) && c.numStatus == 0);

        if (check.Any())
        {
            if (check.Count() == 1)
            {
                ret = check.FirstOrDefault().numPadashCode.ToString();
            }
            else
            {
                foreach (var item in check)
                    ret = ret + item.numPadashCode.ToString() + ",";
            }
        }
        else
        {
            ret = "0";
        }

        return ret;
    }
    //----------------------------------------------------------------------
    //--------------------------مانده حقوق به تفکیک-----------------------
    //----------------------------------------------------------------------
    public int GetPriceMandeHoghoghInSplit(string MandeHoghogh)
    {
        int ret = 0;
        if (MandeHoghogh != "0")
        {
            string[] mandeHogogharray = MandeHoghogh.Split('-');

            for (int i = 0; i <= (mandeHogogharray.Length - 1); i++)
            {
                if (i <= 10)
                {
                    ret = ret + Convert.ToInt32(mandeHogogharray[i]);
                }
                else if (i > 10)
                {
                    ret = ret - Convert.ToInt32(mandeHogogharray[i]);
                }
            }

        }

        return ret;
    }
    //----------------------------------------------------------------------
    //------------------دریافت نام ماه سال---------------------------------
    //----------------------------------------------------------------------
    public string GetMonthName(string MonthCode)
    {
        string ret = "";
        switch (MonthCode)
        {
            case "1": ret = "فروردین"; break;
            case "2": ret = "اردیبهشت"; break;
            case "3": ret = "خرداد"; break;
            case "4": ret = "تیر"; break;
            case "5": ret = "مرداد"; break;
            case "6": ret = "شهریور"; break;
            case "7": ret = "مهر"; break;
            case "8": ret = "آبان"; break;
            case "9": ret = "آذر"; break;
            case "10": ret = "دی"; break;
            case "11": ret = "بهمن"; break;
            case "12": ret = "اسفند"; break;
        }
        return ret;
    }
    //---------------------------------------------------------------------------
    //-----------------------محاسبه مرخصی بدون حقوق----------------------------
    //---------------------------------------------------------------------------
    public string GetPriceMorakhasiBiHoghogh(int price, int personelcode, string month, string year)
    {
        string ret = "0";
        var q = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == personelcode && c.numMonth == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(year) && (new int[] { 6, 7 }).Contains((int)c.numLeaveRef) && (new int[] { 1, 2 }).Contains((int)c.numStatus));
        if (q.Count() > 0)
        {
            string Saati = q.Where(c => c.numLeaveRef == 6).FirstOrDefault() != null ? q.Where(c => c.numLeaveRef == 6).FirstOrDefault().timeLeaveTime : "00:00";
            string rozane = q.Where(c => c.numLeaveRef == 7).FirstOrDefault() != null ? q.Where(c => c.numLeaveRef == 7).FirstOrDefault().timeLeaveTime : "00:00";
            decimal RozSaati = Math.Round((decimal)(((Convert.ToDouble(Saati.Split(':')[0]) / 8) + ((Convert.ToDouble(Saati.Split(':')[1]) / 60) / 8))), 2);
            decimal TimeRozane = Math.Round((decimal)(((Convert.ToDouble(rozane.Split(':')[0]) / 8) + ((Convert.ToDouble(rozane.Split(':')[1]) / 60) / 8))), 2);
            decimal kol = TimeRozane + RozSaati;

            int dayCountInMonth = 30; //default
            var dayInMonth = (from t in office.ofcDayWorkIntoMonths
                              where
                                   t.numMonthJob == Convert.ToInt16(month)
                                   &&
                                   t.numYear == Convert.ToInt16(year)
                              select new
                              {
                                  t.numCountDay
                              }).FirstOrDefault();

            if (dayInMonth != null) dayCountInMonth = Convert.ToInt32(dayInMonth.numCountDay);

            //double b = Convert.ToDouble(price) / Convert.ToDouble(dayCountInMonth);
            double a = Math.Round((Convert.ToDouble(price) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(kol));
            ret = a.ToString();
        }

        return ret;
    }
    //---------------------------------------------------------------------------
    //-------------------------------محاسبه مرخصی دانشجویی---------------------
    //---------------------------------------------------------------------------
    public string GetPriceMorakhasiUniversal(int price, int personelcode, string month, string year)
    {
        string ret = "0";
        var q = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == personelcode && c.numMonth == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(year) && (new int[] { 12, 13 }).Contains((int)c.numLeaveRef) && (new int[] { 1, 2 }).Contains((int)c.numStatus));
        if (q.Count() > 0)
        {
            string Saati = q.Where(c => c.numLeaveRef == 12).FirstOrDefault() != null ? q.Where(c => c.numLeaveRef == 12).FirstOrDefault().timeLeaveTime : "00:00";
            string rozane = q.Where(c => c.numLeaveRef == 13).FirstOrDefault() != null ? q.Where(c => c.numLeaveRef == 13).FirstOrDefault().timeLeaveTime : "00:00";
            decimal RozSaati = Math.Round((decimal)(((Convert.ToDouble(Saati.Split(':')[0]) / 8) + ((Convert.ToDouble(Saati.Split(':')[1]) / 60) / 8))), 2);
            decimal TimeRozane = Math.Round((decimal)(((Convert.ToDouble(rozane.Split(':')[0]) / 8) + ((Convert.ToDouble(rozane.Split(':')[1]) / 60) / 8))), 2);
            decimal kol = TimeRozane + RozSaati;

            int dayCountInMonth = 30; //default
            var dayInMonth = (from t in office.ofcDayWorkIntoMonths
                              where
                                   t.numMonthJob == Convert.ToInt16(month)
                                   &&
                                   t.numYear == Convert.ToInt16(year)
                              select new
                              {
                                  t.numCountDay
                              }).FirstOrDefault();

            if (dayInMonth != null) dayCountInMonth = Convert.ToInt32(dayInMonth.numCountDay);

            //double b = Convert.ToDouble(price) / Convert.ToDouble(dayCountInMonth);
            double a = Math.Round((Convert.ToDouble(price) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(kol));
            ret = a.ToString();
        }

        return ret;
    }
    //---------------------------------------------------------------------
    //--------------------------محاسبه بازخرید مرخصی----------------------
    //---------------------------------------------------------------------
    public string GetPriceBazkharidMorakhasi(int personelcode, int price, int contractkind, string isEidi, string datecutwork, int type, string year, int iscutwork)
    {
        string ret = "0";
        if (isEidi == "true")
        {
            double SumAllMorakhasiSAl = 0;
            decimal SumAllMorakhsiRafte = 0;
            int rozsal = 0;
            int sumRozsal = 0;
            int Lasthoghogh = 0;
            //=================================ghablan dar in sale ghate hamkari shode ya khir===============================
            var checkGhateHamkariGhabli = (from t in office.ofcPersonelPreInvoices
                                           where t.numStatus == 2
                                                 &&
                                                 t.numPersonelRef == personelcode
                                                 &&
                                                 t.strInvoiceYear == year
                                           orderby t.numInvoiceCode descending
                                           select new
                                           {
                                               t.strInvoiceMonth,
                                               t.numContractRef,
                                               t.numPriceReBuyLeave
                                           }).Take(1).FirstOrDefault();
            //===================================daryafte shomare gharardad=============================
            int numcontractref = 0;
            if (checkGhateHamkariGhabli != null && checkGhateHamkariGhabli.numPriceReBuyLeave > 0)//&& checkGhateHamkariGhabliSaati != null)
            {
                numcontractref = Convert.ToInt32(checkGhateHamkariGhabli.numContractRef);
            }
            else
            {
                var checkGhateHamkariGhablisaati = (from t in office.ofcPersonelPreInvoiceSaatis
                                                    where t.numStatus == 2
                                                          &&
                                                          t.numPersonelRef == personelcode
                                                          &&
                                                          t.strInvoiceYear == year
                                                    orderby t.numInvoiceSaatiCode descending
                                                    select new
                                                    {
                                                        t.strInvoiceMonth,
                                                        t.numContractRef,
                                                        t.numPriceReBuyLeave
                                                    }).Take(1).FirstOrDefault();
                if (checkGhateHamkariGhablisaati != null && checkGhateHamkariGhablisaati.numPriceReBuyLeave > 0)//&& checkGhateHamkariGhabliSaati != null)
                {
                    numcontractref = Convert.ToInt32(checkGhateHamkariGhablisaati.numContractRef);
                }
            }

            var checkContract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == personelcode && (c.dateStartContractDate.StartsWith(year)) && ((numcontractref > 0 && c.numContractCode > numcontractref) || numcontractref == 0));
            sumRozsal = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numYear == Convert.ToInt32(year)).Sum(c => c.numCountDay));

            string datecalc = "";
            foreach (var item in checkContract)
            {
                if (item.numContractKindRef == 1)
                {
                    datecalc = GetDateBimehOrDateContract((int)item.numPersonelRef, item.dateStartContractDate);

                    int days = Convert.ToInt32(office.CountdateBetweenDate(datecalc, ((iscutwork == 0 || item.numStatus == 0) ? item.dateCutWorkDate : datecutwork)));

                    if (price == 0) Lasthoghogh = Convert.ToInt32(item.numPersonelSalary);

                    DateTime Date1 = Convert.ToDateTime(office.UDF_Julian_To_Gregorian(office.UDF_Persian_To_Julian(Convert.ToInt32(datecalc.Split('/')[0]), Convert.ToInt32(datecalc.Split('/')[1]), Convert.ToInt32(datecalc.Split('/')[2]))));
                    DateTime Date2 = Convert.ToDateTime(office.UDF_Julian_To_Gregorian(office.UDF_Persian_To_Julian(Convert.ToInt32(((iscutwork == 0 || item.numStatus == 0) ? item.dateCutWorkDate : datecutwork).Split('/')[0]), Convert.ToInt32(((iscutwork == 0 || item.numStatus == 0) ? item.dateCutWorkDate : datecutwork).Split('/')[1]), Convert.ToInt32(((iscutwork == 0 || item.numStatus == 0) ? item.dateCutWorkDate : datecutwork).Split('/')[2]))));
                    int months = (Date2.Year - Date1.Year) * 12 + Date2.Month - Date1.Month;

                    double sumMorakhsi = Convert.ToDouble(Math.Round((decimal)((Convert.ToDouble(26) / 12) * months), 2));
                    SumAllMorakhasiSAl = SumAllMorakhasiSAl + sumMorakhsi;
                    SumAllMorakhasiSAl = SumAllMorakhasiSAl > 26 ? 26 : SumAllMorakhasiSAl;

                    rozsal = rozsal + days;

                    var qsaliane = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == personelcode && c.numYear == Convert.ToInt16(year) && (c.numMonth >= Convert.ToInt32(item.dateStartContractDate.Split('/')[1]) && c.numMonth <= Convert.ToInt32(((iscutwork == 0 || item.numStatus == 0) ? item.dateCutWorkDate : datecutwork).Split('/')[1])) && (new int[] { 4, 5 }).Contains((int)c.numLeaveRef));

                    if (qsaliane.Count() > 0)
                    {
                        double sumTime = 0;
                        foreach (var itemSAl in qsaliane)
                        {
                            sumTime = sumTime + Convert.ToDouble(Math.Round((decimal)(Convert.ToDouble(itemSAl.timeLeaveTime.Split(':')[0])), 2) + Math.Round((decimal)((Convert.ToDouble(itemSAl.timeLeaveTime.Split(':')[1]) / Convert.ToDouble(60))), 2));
                        }

                        SumAllMorakhsiRafte = SumAllMorakhsiRafte + Math.Round((decimal)(sumTime / 8), 2);
                    }

                }
            }
            decimal mojazdarsal = Math.Round((decimal)(Convert.ToDouble(9 * rozsal) / Convert.ToDouble(sumRozsal)), 2);
            decimal mandedarsal = Math.Round((decimal)(SumAllMorakhsiRafte < 0 ? (Convert.ToDouble(SumAllMorakhsiRafte) - SumAllMorakhasiSAl) : (SumAllMorakhasiSAl - Convert.ToDouble(SumAllMorakhsiRafte))), 2);
            decimal bazkharidMande = mandedarsal >= mojazdarsal ? mojazdarsal : mandedarsal;

            if (price == 0) price = Lasthoghogh;
            double priceNahai = Math.Round((Convert.ToDouble(price) / 30) * Convert.ToDouble(bazkharidMande));

            if (type == 1)
                ret = priceNahai.ToString();
            else
                ret = SumAllMorakhasiSAl.ToString() + "^" + SumAllMorakhsiRafte.ToString() + "^" + mandedarsal.ToString() + "^" + mojazdarsal.ToString() + "^" + bazkharidMande.ToString() + "^" + priceNahai.ToString() + "^" + Lasthoghogh.ToString();
        }
        return ret;
    }
    //---------------------------------------------------------------------
    //------------------------------------محاسبه عیدی---------------------
    //---------------------------------------------------------------------
    public string GetPriceEidi(int personelcode, int hoghoghsabet1, string dateStart, string datecutwork, string isEidi, string Year)
    {
        string ret = "0";
        if (isEidi == "true")
        {
            //=================================ghablan dar in sale ghate hamkari shode ya khir===============================
            var checkGhateHamkariGhabli = (from t in office.ofcPersonelPreInvoices
                                           where t.numStatus == 2
                                                 &&
                                                 t.numPersonelRef == personelcode
                                                 &&
                                                 t.strInvoiceYear == Year
                                           orderby t.numInvoiceCode descending
                                           select new
                                           {
                                               t.strInvoiceMonth,
                                               t.numContractRef,
                                               t.numPriceEidi
                                           }).Take(1).FirstOrDefault();
            //===================================daryafte shomare gharardad=============================
            int numcontractref = 0;
            if (checkGhateHamkariGhabli != null && checkGhateHamkariGhabli.numPriceEidi > 0)//&& checkGhateHamkariGhabliSaati != null)
            {
                numcontractref = Convert.ToInt32(checkGhateHamkariGhabli.numContractRef);
            }
            else
            {
                var checkGhateHamkariGhablisaati = (from t in office.ofcPersonelPreInvoiceSaatis
                                                    where t.numStatus == 2
                                                          &&
                                                          t.numPersonelRef == personelcode
                                                          &&
                                                          t.strInvoiceYear == Year
                                                    orderby t.numInvoiceSaatiCode descending
                                                    select new
                                                    {
                                                        t.strInvoiceMonth,
                                                        t.numContractRef,
                                                        t.numPriceEidi
                                                    }).Take(1).FirstOrDefault();
                if (checkGhateHamkariGhablisaati != null && checkGhateHamkariGhablisaati.numPriceEidi > 0)//&& checkGhateHamkariGhabliSaati != null)
                {
                    numcontractref = Convert.ToInt32(checkGhateHamkariGhablisaati.numContractRef);
                }
            }
            //================================================================
            int Daykarkard = 0;
            string datefrom = Year + "/01/01", dateto = Year + "/12/31";
            if (numcontractref > 0)
            {
                var contractcheck = (from t in office.ofcPersonelContracts
                                     orderby t.numContractCode ascending
                                     where
                                           (t.numContractKindRef == 1 || t.numContractKindRef == 3)
                                           &&
                                           t.numContractCode > numcontractref
                                           &&
                                           t.numPersonelRef == personelcode
                                           &&
                                          (string.Compare(t.dateStartContractDate.Trim(), datefrom.Trim()) >= 0 && string.Compare(t.dateStartContractDate.Trim(), dateto.Trim()) <= 0)
                                     select new
                                     {
                                         cntdate = Convert.ToInt32(office.CountdateBetweenDate(GetDateBimehOrDateContract((int)t.numPersonelRef, t.dateStartContractDate), (t.numStatus == 0 ? t.dateCutWorkDate : datecutwork))),
                                         numPersonelSalary = (t.numContractKindRef == 3 ? hoghoghSabet : t.numPersonelSalary),
                                         t.numContractCode,
                                         t.numContractKindRef
                                     });
                if (contractcheck.Any() && (new int[] { 1 }).Contains((int)contractcheck.OrderByDescending(c => c.numContractCode).Take(1).FirstOrDefault().numContractKindRef))
                {
                    if (hoghoghsabet1 == 0)
                        hoghoghsabet1 = Convert.ToInt32(contractcheck.OrderByDescending(c => c.numContractCode).Take(1).FirstOrDefault().numPersonelSalary);


                    var checkEndContract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == personelcode && c.numStatus == 1).FirstOrDefault();
                    if (checkEndContract != null)
                    {
                        if (checkEndContract.numContractKindRef == 1)
                        {
                            int day = Convert.ToInt32(office.CountdateBetweenDate(GetDateBimehOrDateContract((int)checkEndContract.numPersonelRef, checkEndContract.dateStartContractDate), (datecutwork == "" ? checkEndContract.dateCutWorkDate : datecutwork)));
                            int allday = Convert.ToInt32(contractcheck.Sum(c => c.cntdate));
                            int DaykarkardInmonth = Convert.ToInt32(office.CountdateBetweenDate(GetDateBimehOrDateContract((int)checkEndContract.numPersonelRef, checkEndContract.dateStartContractDate), datecutwork));
                            Daykarkard = (allday - day) + DaykarkardInmonth;
                        }
                        else if (checkEndContract.numContractKindRef == 2 || checkEndContract.numContractKindRef == 3)
                        {
                            Daykarkard = Convert.ToInt32(contractcheck.Sum(c => c.cntdate));
                        }
                    }
                }
            }
            else
            {

                //int aa = Convert.ToInt32(office.CountdateBetweenDate(GetDateBimehOrDateContract((int)1010, "1400/01/01"),  datecutwork));


                var contractcheck = (from t in office.ofcPersonelContracts
                                     orderby t.numContractCode ascending
                                     where
                                           (t.numContractKindRef == 1 || t.numContractKindRef == 3)
                                           &&
                                           t.numPersonelRef == personelcode
                                           &&
                                          (string.Compare(t.dateStartContractDate.Trim(), datefrom.Trim()) >= 0 && string.Compare(t.dateStartContractDate.Trim(), dateto.Trim()) <= 0)
                                     select new
                                     {
                                         cntdate = datebetweencount((int)t.numPersonelRef, t.dateStartContractDate, (t.numStatus == 0 ? t.dateCutWorkDate : datecutwork)),
                                         numPersonelSalary = (t.numContractKindRef == 3 ? hoghoghSabet : t.numPersonelSalary),
                                         t.numContractCode,
                                         t.numContractKindRef
                                     }).ToList();
                if (contractcheck.Any() && (new int[] { 1 }).Contains((int)contractcheck.OrderByDescending(c => c.numContractCode).Take(1).FirstOrDefault().numContractKindRef))
                {
                    if (hoghoghsabet1 == 0)
                        hoghoghsabet1 = Convert.ToInt32(contractcheck.OrderByDescending(c => c.numContractCode).Take(1).FirstOrDefault().numPersonelSalary);

                    var checkEndContract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == personelcode && c.numStatus == 1).FirstOrDefault();
                    if (checkEndContract != null)
                    {
                        if (checkEndContract.numContractKindRef == 1)
                        {
                            int day = Convert.ToInt32(office.CountdateBetweenDate(GetDateBimehOrDateContract((int)checkEndContract.numPersonelRef, checkEndContract.dateStartContractDate), (datecutwork == "" ? checkEndContract.dateCutWorkDate : datecutwork)));
                            int allday = Convert.ToInt32(contractcheck.Sum(c => c.cntdate));
                            int DaykarkardInmonth = Convert.ToInt32(office.CountdateBetweenDate(GetDateBimehOrDateContract((int)checkEndContract.numPersonelRef, checkEndContract.dateStartContractDate), datecutwork));
                            Daykarkard = (allday - day) + DaykarkardInmonth;
                        }
                        else if (checkEndContract.numContractKindRef == 2 || checkEndContract.numContractKindRef == 3)
                        {
                            Daykarkard = Convert.ToInt32(contractcheck.Sum(c => c.cntdate));
                        }
                    }
                }
            }
            //================================================================

            //   int Daykarkard = Convert.ToInt32(office.CountdateBetweenDate(dateStart, datecutwork));
            int rozsal = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numYear == Convert.ToInt32(Year)).Sum(c => c.numCountDay));
            double eidi = (Convert.ToDouble((hoghoghsabet1 * 2)) / Convert.ToDouble(rozsal)) * Convert.ToDouble(Daykarkard);
            ret = Convert.ToInt32(Math.Round(eidi)).ToString();
        }
        return ret;
    }

    private int datebetweencount(int numPersonelRef, string dateStartContractDate, string datecalc)
    {
        return Convert.ToInt32(office.CountdateBetweenDate(GetDateBimehOrDateContract(numPersonelRef, dateStartContractDate), datecalc));
    }

    //----------------------------------------------------------------------
    //--------------محاسبه مبلغ کارکرد بیمه قطع همکاری-------------------
    //----------------------------------------------------------------------
    public int GetPriceKarkardBimeh2(int personelcode, int price, string datestart, string dateEnd, int year, int month, int contractkind, int iscutwork)
    {
        int ret = 0;
        int checkret = 0;
        //if (iscutwork == 0)
        //{
            if (contractkind == 1 || contractkind == 3)
            {
                var PriceMonth = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month.ToString() && c.strInvoiceYear == year.ToString()).FirstOrDefault();
                if (PriceMonth != null)
                {
                    ret = 0;
                    checkret = 1;
                }
            }
            else
            {
                var PriceMonth1 = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month.ToString() && c.strInvoiceYear == year.ToString()).FirstOrDefault();
                if (PriceMonth1 != null)
                {
                    ret = 0;
                    checkret = 1;
                }
            }
        //}
        //======================================================================================
        if (checkret == 0)
        {
            int dayCountInMonth = 30; //default
            int dayKarkard = 0;
            int CntkBimeMaheGhabl = 1;
            double PriceKol = 0;

            //if (iscutwork == 0)
            //{
            var checkBimeh = office.ofcPersonelBimehs.Where(c => c.numPersonelRef == personelcode && c.numStatus == 2 && (c.dateEndBimehDate == "" || c.dateEndBimehDate == null)).FirstOrDefault();
            if (checkBimeh != null)
            {
                datestart = checkBimeh.dateStartBimehDate;

                // }
                if (!String.IsNullOrEmpty(datestart))
                {
                    string[] arrayDateStart = datestart.Split('/');
                    int yearBimeh = Convert.ToInt32(arrayDateStart[0]);
                    int monthBImeh = Convert.ToInt32(arrayDateStart[1]);
                    int dayBimeh = Convert.ToInt32(arrayDateStart[2]);

                    string[] arrayDateEnd = dateEnd.Split('/');

                    if (Convert.ToInt32(arrayDateStart[0]) == year && Convert.ToInt32(arrayDateStart[1]) == month)
                    {
                        CntkBimeMaheGhabl = 1;
                    }
                    else
                    {
                        if (contractkind == 1 || contractkind == 3)
                        {
                            var checkPreInvoice2 = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == personelcode && (new int[] { 1, 2 }).Contains((int)c.numStatus)).OrderByDescending(c => c.numInvoiceCode).Take(3);
                            if (Convert.ToInt32(checkPreInvoice2.Sum(c => c.numPricePersonelBimeh)) > 0)
                            {
                                CntkBimeMaheGhabl = 1; // yek mah bimeh kam beshe
                            }
                            else
                            {
                                CntkBimeMaheGhabl = 2; // baiad 2 mah bime kam beshe
                            }
                        }
                        else if (contractkind == 2)
                        {
                            var checkPreInvoice2 = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numPersonelRef == personelcode && (new int[] { 1, 2 }).Contains((int)c.numStatus)).OrderByDescending(c => c.numInvoiceSaatiCode).Take(3);
                            if (Convert.ToInt32(checkPreInvoice2.Sum(c => c.numPricePersonelBimeh)) > 0)
                            {
                                CntkBimeMaheGhabl = 1; // yek mah bimeh kam beshe
                            }
                            else
                            {
                                CntkBimeMaheGhabl = 2; // baiad 2 mah bime kam beshe
                            }
                        }
                    }

                    if (CntkBimeMaheGhabl == 2)
                    {
                        int monthcount = 0;
                        //===============================mahaie pish====================================================
                        if (year == yearBimeh)
                        {
                            var dayInMonthBefore = office.ofcDayWorkIntoMonths.Where(t => (t.numMonthJob >= monthBImeh && t.numMonthJob <= month) && t.numYear == yearBimeh);
                            if (dayInMonthBefore.Count() == 0)
                                dayCountInMonth = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == month && c.numYear == year).FirstOrDefault().numCountDay);// faghat yek mah mohasebe shavad
                            else
                                dayCountInMonth = Convert.ToInt32(dayInMonthBefore.Sum(c => c.numCountDay));

                            monthcount = dayInMonthBefore.Count();
                        }
                        else if (year != yearBimeh)
                        {
                            //==================================majmoe roze kari parsal ===========================
                            var dayInMonthBefore = office.ofcDayWorkIntoMonths.Where(t => (t.numMonthJob >= monthBImeh && t.numMonthJob <= 12) && t.numYear == yearBimeh);
                            if (dayInMonthBefore.Count() == 0)
                                dayCountInMonth = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == month && c.numYear == year).FirstOrDefault().numCountDay);// faghat yek mah mohasebe shavad
                            else
                                dayCountInMonth = Convert.ToInt32(dayInMonthBefore.Sum(c => c.numCountDay));
                            monthcount = dayInMonthBefore.Count();

                            //====================================majmoe roze kari emsal=========================
                            var dayInMonthBefore2 = office.ofcDayWorkIntoMonths.Where(t => (t.numMonthJob >= 1 && t.numMonthJob <= month) && t.numYear == year);
                            if (dayInMonthBefore2.Count() == 0)
                                dayCountInMonth = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == month && c.numYear == year).FirstOrDefault().numCountDay); // faghat yek mah mohasebe shavad
                            else
                                dayCountInMonth = dayCountInMonth + Convert.ToInt32(dayInMonthBefore2.Sum(c => c.numCountDay));

                            monthcount = monthcount + dayInMonthBefore2.Count();
                        }

                        //
                        // int mahefeliDay = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == month && c.numYear == year).FirstOrDefault().numCountDay);
                        // monthcount = monthcount - 1;
                        //======================================================= tedad roz mahe feli ro azash kam kone =======================
                        // dayCountInMonth = dayCountInMonth - mahefeliDay;
                        // dayKarkard = (dayCountInMonth - dayBimeh) + 1;
                        //dayCountInMonth = 30; //sabet
                        // PriceKol = ((Convert.ToDouble(price) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard)) * monthcount;
                        //=======================================================
                        //dayKarkard = Convert.ToInt32(arrayDateEnd[2]); /// roze paian
                        //mahefeliDay = 30; //sabet
                        // PriceKol = PriceKol + ((Convert.ToDouble(price) / Convert.ToDouble(mahefeliDay)) * Convert.ToDouble(dayKarkard));

                        if (iscutwork == 1)
                        {
                            PriceKol = Convert.ToDouble(price); // majome mah ghablan hesab shode
                        }
                        else
                        {
                            dayKarkard = (dayCountInMonth - dayBimeh) + 1;
                            var contract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == personelcode && c.numStatus == 1).FirstOrDefault();
                            if (contract != null)
                            {
                                price = contract.numContractKindRef == 3 ? BimehProjectAndSaati : Convert.ToInt32(contract.numPersonelSalary + contract.numPersonelHomeSalary + contract.numPersonelBon);
                                dayCountInMonth = 30;
                                PriceKol = (Convert.ToDouble(price) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard);
                            }
                            else
                                PriceKol = 0;
                        }

                    }
                    else
                    {
                        //var dayInMonth = (from t in office.ofcDayWorkIntoMonths
                        //                  where
                        //                       t.numMonthJob == month
                        //                       &&
                        //                       t.numYear == year
                        //                  select new
                        //                  {
                        //                      t.numCountDay
                        //                  }).FirstOrDefault();

                        //if (dayInMonth != null) dayCountInMonth = Convert.ToInt32(dayInMonth.numCountDay);
                        //if (Convert.ToInt32(arrayDateStart[0]) == year && Convert.ToInt32(arrayDateStart[1]) == month)
                        //{
                        //    if (Convert.ToInt32(arrayDateEnd[0]) == year && Convert.ToInt32(arrayDateEnd[1]) == month)
                        //        dayKarkard = (Convert.ToInt32(arrayDateEnd[2]) - Convert.ToInt32(arrayDateStart[2])) + 1;
                        //    else
                        //    {
                        //        dayCountInMonth = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == month && c.numYear == year).FirstOrDefault().numCountDay);
                        //        dayKarkard = (dayCountInMonth - Convert.ToInt32(arrayDateStart[2])) + 1;
                        //    }
                        //}
                        //else
                        //{
                        //    if (Convert.ToInt32(arrayDateEnd[0]) == year && Convert.ToInt32(arrayDateEnd[1]) == month)
                        //        dayKarkard = Convert.ToInt32(arrayDateEnd[2]);
                        //    else
                        //    {
                        //        dayCountInMonth = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == month && c.numYear == year).FirstOrDefault().numCountDay);
                        //        dayKarkard = (dayCountInMonth - 1) + 1;
                        //    }
                        //}
                        //PriceKol = (Convert.ToDouble(price) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard);
                        PriceKol = Convert.ToDouble(price);
                    }
                    ret = Convert.ToInt32(Math.Round(PriceKol));
                }
            }
        }
        return ret;
    }

    //---------------------------------------------------------------------------
    //------------------دریافت تاریخ بیمه برای محاسبه عیدی و بازخرید مرخصی----------------------------------
    //---------------------------------------------------------------------------
    public string GetDateBimehOrDateContract(int numpersonelCode, string dateContract)
    {
        var bimecheck = office.ofcPersonelBimehs.Where(x => x.numPersonelRef == numpersonelCode && x.numStatus == 2).OrderByDescending(x => x.numBimehCode).FirstOrDefault();
        if (bimecheck != null)
        {
            string yearnow = _PDate.PersianDate.Split('/')[0];
            string yearbimeh = bimecheck.dateStartBimehDate.Split('/')[0];
            if (yearnow.Trim() == yearbimeh.Trim())
                return bimecheck.dateStartBimehDate;
            else
                return dateContract;
        }
        else
            return "";


    }

    //----------------------------------------------------------------------
    //----------------------------محاسبه کارکرد قطع همکاری----------------
    //----------------------------------------------------------------------
    public int GetPriceKarkard10roz(int price, string datestart, int year, int month, string dateEnd, int iscutwork, int personelcode)
    {
        int ret = 0;
        int dayCountInMonth = 30; //default
        int dayKarkard = 10;
        double PriceKol = (Convert.ToDouble(price) / Convert.ToDouble(dayCountInMonth)) * Convert.ToDouble(dayKarkard);
        ret = Convert.ToInt32(Math.Round(PriceKol));
        return ret;
    }
    public int GetPriceKarkardCutWork(int price, string datestart, string dateEnd, int year, int month, int ContractKindRef, int personelcode, int iscutwork)
    {
        int ret = 0;
        int ret10 = 0;
        int checkret = 0;
        if (ContractKindRef == 1 || ContractKindRef == 3)
        {
            var PriceMonth = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month.ToString() && c.strInvoiceYear == year.ToString()).FirstOrDefault();
            if (PriceMonth != null)
            {
                ret = 0;
                checkret = 1;
            }
            ret10 = GetPriceKarkard10roz(price, datestart, year, month, dateEnd, iscutwork, personelcode);
        }
        else
        {
            var PriceMonth1 = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month.ToString() && c.strInvoiceYear == year.ToString()).FirstOrDefault();
            if (PriceMonth1 != null)
            {
                ret = 0;
                checkret = 1;
            }

        }
        //======================================================================================
        if (checkret == 0)
        {
            ret = GetPriceKarkard(price, datestart, year, month, dateEnd, iscutwork, personelcode);
        }


        return ret + ret10;
    }
    //---------------------------------------------------------------------
    //-------------------دریافت مبلغ مانده وام قطع همکاری----------------
    //---------------------------------------------------------------------
    public string GetMandeVamCutWork(int personelcode, int type)
    {
        string ret = "0";
        var qVam = office.ofcPersonelVams.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).FirstOrDefault();
        if (qVam != null)
        {
            if (type == 1)
                ret = GetMandeVam(personelcode, qVam.numVamCode);
            else if (type == 2)
                ret = qVam.numVamCode.ToString();
        }
        return ret;
    }
    //---------------------------------------------------------------------------
    //------------------دریافت مبلغ مانده وام----------------------------------
    //---------------------------------------------------------------------------
    public string GetMandeVam(int numpersonelCode, int vamref)
    {
        int SumVamTasvieh = Convert.ToInt32(office.ofcPersonelTasviehVams.Where(c => c.numPersonelRef == numpersonelCode && c.numVamRef == vamref).Sum(c => c.numPriceGhestVam));
        var q = office.ofcPersonelVams.Where(c => c.numPersonelRef == numpersonelCode && c.numVamCode == vamref).FirstOrDefault();
        int VamKol = 0;
        if (q != null)
        {
            VamKol = Convert.ToInt32(q.numPriceVam);
        }
        return (VamKol - SumVamTasvieh).ToString();
    }
    //----------------------------------------------------------------------
    //----------------------محاسبه عیدی تسویه حساب آخر سال----------------
    //----------------------------------------------------------------------
    public string GetEidiAndRozKarkard(int personelcode, int hoghoghsabet1, string dateStart, int level, string Year)
    {
        // type:1 --> eidi
        // type:2 --> rozkarkard
        string ret = "0";
        var checkGhateHamkariGhabli = (from t in office.ofcPersonelPreInvoices
                                       where t.numStatus == 2
                                             &&
                                             t.numPersonelRef == personelcode
                                             &&
                                             t.strInvoiceYear == Year
                                       orderby t.numInvoiceCode descending
                                       select new
                                       {
                                           t.strInvoiceMonth,
                                           t.numContractRef,
                                           t.numPriceEidi
                                       }).Take(1).FirstOrDefault();
        int numcontractref = 0;
        if (checkGhateHamkariGhabli != null && checkGhateHamkariGhabli.numPriceEidi > 0)//&& checkGhateHamkariGhabliSaati != null)
        {
            numcontractref = Convert.ToInt32(checkGhateHamkariGhabli.numContractRef);
        }
        else
        {
            var checkGhateHamkariGhablisaati = (from t in office.ofcPersonelPreInvoiceSaatis
                                                where t.numStatus == 2
                                                      &&
                                                      t.numPersonelRef == personelcode
                                                      &&
                                                      t.strInvoiceYear == Year
                                                orderby t.numInvoiceSaatiCode descending
                                                select new
                                                {
                                                    t.strInvoiceMonth,
                                                    t.numContractRef,
                                                    t.numPriceEidi
                                                }).Take(1).FirstOrDefault();
            if (checkGhateHamkariGhablisaati != null && checkGhateHamkariGhablisaati.numPriceEidi > 0)//&& checkGhateHamkariGhabliSaati != null)
            {
                numcontractref = Convert.ToInt32(checkGhateHamkariGhablisaati.numContractRef);
            }
        }
        //======================================================================================================
        string datefrom = Year + "/01/01", dateto = Year + "/12/31";
        string dateCutwork = Year + "/12/29";
        int Daykarkard = 0;
        if (numcontractref > 0)
        {
            var contractcheck = (from t in office.ofcPersonelContracts
                                 orderby t.numContractCode ascending
                                 where
                                       t.numContractKindRef == 1
                                       &&
                                       t.numContractCode > numcontractref
                                       &&
                                       t.numPersonelRef == personelcode
                                       &&
                                      (string.Compare(t.dateStartContractDate.Trim(), datefrom.Trim()) >= 0 && string.Compare(t.dateStartContractDate.Trim(), dateto.Trim()) <= 0)
                                 select new
                                 {
                                     cntdate = Convert.ToInt32(office.CountdateBetweenDate(t.dateStartContractDate, t.dateCutWorkDate)),
                                     numPersonelSalary = (t.numContractKindRef == 3 ? hoghoghSabet : t.numPersonelSalary),
                                     t.numContractCode
                                     // t.dateStartContractDate
                                 });
            if (contractcheck.Any())
            {
                if (hoghoghsabet1 == 0)
                    hoghoghsabet1 = Convert.ToInt32(contractcheck.OrderByDescending(c => c.numContractCode).Take(1).FirstOrDefault().numPersonelSalary);


                var checkEndContract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == personelcode && c.numStatus == 1).FirstOrDefault();
                if (checkEndContract != null)
                {
                    if (checkEndContract.numContractKindRef == 1)
                    {
                        int day = Convert.ToInt32(office.CountdateBetweenDate(checkEndContract.dateStartContractDate, checkEndContract.dateCutWorkDate));
                        int allday = Convert.ToInt32(contractcheck.Sum(c => c.cntdate));

                        var contractcheckInmonth = (from t in office.ofcPersonelContracts
                                                    orderby t.numContractCode ascending
                                                    where
                                                          t.numContractKindRef == 1
                                                          &&
                                                          t.numContractCode > numcontractref
                                                          &&
                                                          t.numPersonelRef == personelcode
                                                          &&
                                                         (string.Compare(t.dateStartContractDate.Trim(), checkEndContract.dateStartContractDate.Trim()) >= 0 && string.Compare(t.dateStartContractDate.Trim(), dateCutwork.Trim()) <= 0)
                                                    select new
                                                    {
                                                        cntdate = Convert.ToInt32(office.CountdateBetweenDate(t.dateStartContractDate, t.dateCutWorkDate)),
                                                    });
                        int DaykarkardInmonth = Convert.ToInt32(contractcheckInmonth.Sum(c => c.cntdate));
                        Daykarkard = (allday - day) + DaykarkardInmonth;
                    }
                    else if (checkEndContract.numContractKindRef == 2 || checkEndContract.numContractKindRef == 3)
                    {

                        Daykarkard = Convert.ToInt32(contractcheck.Sum(c => c.cntdate));
                    }
                }
            }

        }
        else
        {
            var contractcheck = (from t in office.ofcPersonelContracts
                                 orderby t.numContractCode ascending
                                 where
                                       t.numContractKindRef == 1
                                       &&
                                       t.numPersonelRef == personelcode
                                       &&
                                      (string.Compare(t.dateStartContractDate.Trim(), datefrom.Trim()) >= 0 && string.Compare(t.dateStartContractDate.Trim(), dateto.Trim()) <= 0)
                                 select new
                                 {
                                     cntdate = Convert.ToInt32(office.CountdateBetweenDate(t.dateStartContractDate, t.dateCutWorkDate)),
                                     numPersonelSalary = (t.numContractKindRef == 3 ? hoghoghSabet : t.numPersonelSalary),
                                     t.numContractCode
                                     // t.dateStartContractDate
                                 });
            if (contractcheck.Any())
            {
                if (hoghoghsabet1 == 0)
                    hoghoghsabet1 = Convert.ToInt32(contractcheck.OrderByDescending(c => c.numContractCode).Take(1).FirstOrDefault().numPersonelSalary);


                var checkEndContract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == personelcode && c.numStatus == 1).FirstOrDefault();
                if (checkEndContract != null)
                {
                    if (checkEndContract.numContractKindRef == 1)
                    {
                        int day = Convert.ToInt32(office.CountdateBetweenDate(checkEndContract.dateStartContractDate, checkEndContract.dateCutWorkDate));
                        int allday = Convert.ToInt32(contractcheck.Sum(c => c.cntdate));
                        var contractcheckInmonth = (from t in office.ofcPersonelContracts
                                                    orderby t.numContractCode ascending
                                                    where
                                                          t.numContractKindRef == 1
                                                          &&
                                                          t.numPersonelRef == personelcode
                                                          &&
                                                         (string.Compare(t.dateStartContractDate.Trim(), checkEndContract.dateStartContractDate.Trim()) >= 0 && string.Compare(t.dateStartContractDate.Trim(), dateCutwork.Trim()) <= 0)
                                                    select new
                                                    {
                                                        cntdate = Convert.ToInt32(office.CountdateBetweenDate(t.dateStartContractDate, t.dateCutWorkDate)),
                                                    });
                        int DaykarkardInmonth = Convert.ToInt32(contractcheckInmonth.Sum(c => c.cntdate));
                        Daykarkard = (allday - day) + DaykarkardInmonth;
                    }
                    else if (checkEndContract.numContractKindRef == 2 || checkEndContract.numContractKindRef == 3)
                    {
                        Daykarkard = Convert.ToInt32(contractcheck.Sum(c => c.cntdate));
                    }
                }
            }
        }
        //=================================================================================================

        //int Daykarkard = Convert.ToInt32(office.CountdateBetweenDate(dateStart, dateCutwork));
        double eidi = (Convert.ToDouble((hoghoghsabet1 * 2)) / Convert.ToDouble(365)) * Convert.ToDouble(Daykarkard);
        ret = Convert.ToInt32(Math.Round(eidi / Convert.ToDouble(level))).ToString() + "^" + Daykarkard.ToString() + "^" + hoghoghsabet1.ToString();

        return ret;
    }
    //----------------------------------------------------------------------
    //--------------------------محاسبه مرخصی آخر سال-----------------------
    //----------------------------------------------------------------------
    public string GetMorakhasi(int personelcode, int price, int numcontractkindref, string year)
    {
        string ret = "";
        double SumAllMorakhasiSAl = 0;
        decimal SumAllMorakhsiRafte = 0;
        int rozsal = 0;
        int sumRozsal = 0;
        int Lasthoghogh = 0;
        var checkGhateHamkariGhabli = (from t in office.ofcPersonelPreInvoices
                                       where t.numStatus == 2
                                             &&
                                             t.numPersonelRef == personelcode
                                             &&
                                             t.strInvoiceYear == year
                                       orderby t.numInvoiceCode descending
                                       select new
                                       {
                                           t.strInvoiceMonth,
                                           t.numContractRef,
                                           t.numPriceReBuyLeave
                                       }).Take(1).FirstOrDefault();
        int numcontractref = 0;
        if (checkGhateHamkariGhabli != null && checkGhateHamkariGhabli.numPriceReBuyLeave > 0)//&& checkGhateHamkariGhabliSaati != null)
        {
            numcontractref = Convert.ToInt32(checkGhateHamkariGhabli.numContractRef);
        }
        else
        {
            var checkGhateHamkariGhablisaati = (from t in office.ofcPersonelPreInvoiceSaatis
                                                where t.numStatus == 2
                                                      &&
                                                      t.numPersonelRef == personelcode
                                                      &&
                                                      t.strInvoiceYear == year
                                                orderby t.numInvoiceSaatiCode descending
                                                select new
                                                {
                                                    t.strInvoiceMonth,
                                                    t.numContractRef,
                                                    t.numPriceReBuyLeave
                                                }).Take(1).FirstOrDefault();
            if (checkGhateHamkariGhablisaati != null && checkGhateHamkariGhablisaati.numPriceReBuyLeave > 0)//&& checkGhateHamkariGhabliSaati != null)
            {
                numcontractref = Convert.ToInt32(checkGhateHamkariGhablisaati.numContractRef);
            }
        }


        var checkContract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == personelcode && (c.dateStartContractDate.StartsWith(year)) && ((numcontractref > 0 && c.numContractCode > numcontractref) || numcontractref == 0));
        sumRozsal = Convert.ToInt32(office.ofcDayWorkIntoMonths.Where(c => c.numYear == Convert.ToInt32(year)).Sum(c => c.numCountDay));

        foreach (var item in checkContract)
        {
            if (item.numContractKindRef == 1)
            {
                int days = Convert.ToInt32(office.CountdateBetweenDate(item.dateStartContractDate, item.dateCutWorkDate));

                if (price == 0) Lasthoghogh = Convert.ToInt32(item.numPersonelSalary);

                DateTime Date1 = Convert.ToDateTime(office.UDF_Julian_To_Gregorian(office.UDF_Persian_To_Julian(Convert.ToInt32(item.dateStartContractDate.Split('/')[0]), Convert.ToInt32(item.dateStartContractDate.Split('/')[1]), Convert.ToInt32(item.dateStartContractDate.Split('/')[2]))));
                DateTime Date2 = Convert.ToDateTime(office.UDF_Julian_To_Gregorian(office.UDF_Persian_To_Julian(Convert.ToInt32(item.dateCutWorkDate.Split('/')[0]), Convert.ToInt32(item.dateCutWorkDate.Split('/')[1]), Convert.ToInt32(item.dateCutWorkDate.Split('/')[2]))));
                int months = (Date2.Year - Date1.Year) * 12 + Date2.Month - Date1.Month;

                double sumMorakhsi = Convert.ToDouble(Math.Round((decimal)((Convert.ToDouble(26) / 12) * months), 2));
                SumAllMorakhasiSAl = SumAllMorakhasiSAl + sumMorakhsi;

                SumAllMorakhasiSAl = SumAllMorakhasiSAl > 26 ? 26 : SumAllMorakhasiSAl;
                rozsal = rozsal + days;

                var qsaliane = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == personelcode && c.numYear == Convert.ToInt16(year) && (c.numMonth >= Convert.ToInt32(item.dateStartContractDate.Split('/')[1]) && c.numMonth <= Convert.ToInt32(item.dateCutWorkDate.Split('/')[1])) && (new int[] { 4, 5 }).Contains((int)c.numLeaveRef));

                if (qsaliane.Count() > 0)
                {
                    double sumTime = 0;
                    foreach (var itemSAl in qsaliane)
                    {
                        sumTime = sumTime + Convert.ToDouble(Math.Round((decimal)(Convert.ToDouble(itemSAl.timeLeaveTime.Split(':')[0])), 2) + Math.Round((decimal)((Convert.ToDouble(itemSAl.timeLeaveTime.Split(':')[1]) / Convert.ToDouble(60))), 2));
                    }

                    SumAllMorakhsiRafte = SumAllMorakhsiRafte + Math.Round((decimal)(sumTime / 8), 2);
                }

            }
        }
        decimal mojazdarsal = Math.Round((decimal)(Convert.ToDouble(9 * rozsal) / Convert.ToDouble(sumRozsal)), 2);
        decimal mandedarsal = Math.Round((decimal)(SumAllMorakhsiRafte < 0 ? (Convert.ToDouble(SumAllMorakhsiRafte) - SumAllMorakhasiSAl) : (SumAllMorakhasiSAl - Convert.ToDouble(SumAllMorakhsiRafte))), 2);
        decimal bazkharidMande = mandedarsal >= mojazdarsal ? mojazdarsal : mandedarsal;

        if (price == 0) price = Lasthoghogh;
        double priceNahai = Math.Round((Convert.ToDouble(price) / 30) * Convert.ToDouble(bazkharidMande));

        return ret = SumAllMorakhasiSAl.ToString() + "^" + SumAllMorakhsiRafte.ToString() + "^" + mandedarsal.ToString() + "^" + mojazdarsal.ToString() + "^" + bazkharidMande.ToString() + "^" + priceNahai.ToString() + "^" + Lasthoghogh.ToString();
    }
    //---------------------------------------------------------------------------
    //-------------------------------------ساعت و ماه---------------------------
    //---------------------------------------------------------------------------
    public string GetSplitString(string str)
    {
        string res = "";
        if (string.IsNullOrEmpty(str)) return res;
        else
            res = (str.Split('-')[0]) + " " + ((str.Split('-')[1]) == "1" ? "ساعت" : "روز") + " در " + ((str.Split('-')[2]) == "1" ? "هفته" : "ماه");
        return res;
    }
    //---------------------------------------------------------------------------
    //---------------جدا کردن عیدی و تاریخ از آرایه رشته ای-------------------
    //---------------------------------------------------------------------------
    public string GetPriceAndDateFromArray(int personelcode, string arrayCutWork, int type)
    {
        string Ret = "";
        string[] arrayTemp = arrayCutWork.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();

        foreach (var item in arrayTemp)
        {
            if (Convert.ToInt32(item.Split('^')[0].Trim()) == personelcode)
            {
                if (type == 1) // true / false
                    Ret = item.Split('^')[4].Trim();
                else if (type == 2) // tarikh ghate hamkari
                    Ret = item.Split('^')[1].Trim();
                else if (type == 3) // mablaghe saier
                    Ret = item.Split('^')[2].Trim();
                else if (type == 4) // tozihate saier
                    Ret = item.Split('^')[3].Trim();
                else if (type == 5) // SalJari
                    Ret = item.Split('^')[5].Trim();
            }
        }

        return Ret;
    }
    //---------------------------------------------------------------------
    //-------------------------دریافت اطلاعات اموال پرسنل-----------------
    //---------------------------------------------------------------------
    public string GetAllAmvalInfo(int personelcode, int type)
    {
        var res = (from t in office.ofcPersonelAmvals
                   join t1 in office.ofcBAmvals on t.numAmvalRef equals t1.numAmvalCode
                   where
                   t.numStatus == 1
                   &&
                   t.numPersonelRef == personelcode
                   select new
                   {
                       numAmvalRef = (int)t.numAmvalRef,
                       strAmvalName = t1.strAmvalName,
                       numCountPersonelAmval = (int)t.numCountPersonelAmval
                   }).ToList();

        var res1 = (from t in office.ofcPersonelVagozarAmvals
                    join t1 in office.ofcBAmvals on t.numAmvalRef equals t1.numAmvalCode
                    where
                    t.numStatus == 1
                    &&
                    t.numPersonelRef == personelcode
                    select new
                    {
                        numAmvalRef = (int)t.numAmvalRef,
                        strAmvalName = t1.strAmvalName,
                        numCountPersonelAmval = (int)t.numCountPersonelAmval,
                    }).ToList();

        //-----------------------------------------
        string info1 = "";
        int row = 1;
        foreach (var item in res)
        {
            info1 = info1 + (type == 1 ? " □ " : "") + row.ToString() + "- " + item.strAmvalName + " " + item.numCountPersonelAmval.ToString() + " عدد\n";
            row++;
        }
        //-----------------------------------------

        string info2 = "";
        row = 1;
        foreach (var item in res1)
        {
            info2 = info2 + (type == 1 ? " □ " : "") + row.ToString() + "- " + item.strAmvalName + " " + item.numCountPersonelAmval.ToString() + " عدد\n";
            row++;
        }

        return (info1 != "" ? "اموال در اختیار شامل : \n" + info1 : info1) + (info2 != "" ? "\nاموال واگذار شده شامل : \n" + info2 : info2);
    }
    //---------------------------------------------------------------------
    //-----------------مبلغ اموال پرسنل کل / در اختیار/واگذارشده--------
    //---------------------------------------------------------------------
    public string PriceAmvalPersonel(int personelcode, int type)
    {
        string ret = "";
        int res = 0;
        int resvagozar = 0;
        //=============================================================
        if (type == 1 || type == 3 || type == 4)
            res = Convert.ToInt32(office.ofcPersonelAmvals.Where(c => c.numPersonelRef == personelcode && c.numStatus == 1).Sum(c => c.numCountPersonelAmval * c.numPricePersonelAmval));
        if (type == 2 || type == 3 || type == 4)
            resvagozar = Convert.ToInt32(office.ofcPersonelVagozarAmvals.Where(c => c.numPersonelRef == personelcode && c.numStatus == 1).Sum(c => c.numCountPersonelAmval * c.numPricePersonelAmval));
        //=============================================================
        if (type == 1 || type == 2 || type == 3)
            ret = (res + resvagozar).ToString();
        else if (type == 4)
            ret = (res > 0 && resvagozar > 0 ? "هم اموال در اختیار و هم اموال واگذار شده ، در نزد ایشان می باشد " : res > 0 && resvagozar == 0 ? "اموال در اختیار ، در نزد ایشان می باشد ." : res == 0 && resvagozar > 0 ? "اموال واگذار شده ، در نزد ایشان می باشد ." : "هیچ اقلامی از شرکت نزد ایشان نمی باشد، لذا تسویه حساب بلامانع می باشد.");

        return ret;
    }
    //---------------------------------------------------------------------
    //-----------------------------محاسبه عیدی----------------------------
    //---------------------------------------------------------------------
    public string GetPriceEidiCutWork(int personelcode, int hoghoghsabet1, string dateStart, string arrayCutWork)
    {
        string ret = "0";
        string result = GetPriceAndDateFromArray(personelcode, arrayCutWork, 1);
        if (result == "true")
        {
            string datecutwork = GetPriceAndDateFromArray(personelcode, arrayCutWork, 2);
            string Year = GetPriceAndDateFromArray(personelcode, arrayCutWork, 5);
            ret = GetPriceEidi(personelcode, hoghoghsabet1, dateStart, datecutwork, result, Year);
        }
        return ret;
    }
    //---------------------------------------------------------------------
    //----------محاسبه مانده حقوق از ماه قبل قطع همکاری-----------------
    //---------------------------------------------------------------------
    public string GetMandeHoghoghAzMaheGhablCutWork(int personelcode, int numContractKindref, string arrayCutWork, int type)
    {
        string ret = "0";
        int month = 0, year = 0;
        if (numContractKindref == 1 || numContractKindref == 3)
        {
            var karkard = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobCode).Take(1).FirstOrDefault();
            if (karkard.numMonthJob == 1)
            {
                month = 12;
                year = Convert.ToInt32(karkard.numYear) - 1;
            }
            else
            {
                month = Convert.ToInt32(karkard.numMonthJob) - 1;
                year = Convert.ToInt32(karkard.numYear);
            }
        }
        else if (numContractKindref == 2)
        {
            var karkardsaati = office.ofcPersonelMonthlyJobSaatis.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobSaatiCode).Take(1).FirstOrDefault();
            if (karkardsaati.numMonthJob == 1)
            {
                month = 12;
                year = Convert.ToInt32(karkardsaati.numYear) - 1;
            }
            else
            {
                month = Convert.ToInt32(karkardsaati.numMonthJob) - 1;
                year = Convert.ToInt32(karkardsaati.numYear);
            }
        }

        //==============================================================================
        //if (numContractKindref == 1 || numContractKindref == 3)
        //{
        //    var checkprice = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == personelcode && c.strInvoiceYear == year.ToString() && c.strInvoiceMonth == month.ToString()).FirstOrDefault();
        //    if (checkprice == null)
        //    {
        //        var contract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == personelcode && c.numStatus == 1).FirstOrDefault();
        //        if (contract != null)
        //        {
        //            //int daykarkard = 30;
        //            //var monthday = office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == month && c.numYear == year).FirstOrDefault();
        //            //if (monthday != null) daykarkard = Convert.ToInt32(monthday);

        //            string array = arrayCutWork; //"0^" + year + "/" + (month.ToString().Length == 1 ? "0" + month.ToString() : month.ToString()) + "/" + daykarkard.ToString() + "^0^0^0^0,";
        //            string datecutwork = GetPriceAndDateFromArray(personelcode, arrayCutWork, 2);

        //            int hoghogh = Convert.ToInt32(GetMandeHoghoghForCutWork(personelcode, Convert.ToInt32(contract.numPersonelSalary), contract.dateStartContractDate, numContractKindref, array, 1));
        //            int padashamalkard = Convert.ToInt32(GetMandeHoghoghForCutWork1(personelcode, Convert.ToInt32(contract.numPersonelPadash), contract.dateStartContractDate, numContractKindref, array));
        //            int haghmaskan = Convert.ToInt32(GetMandeHoghoghForCutWork(personelcode, Convert.ToInt32(contract.numContractKindRef == 3 || contract.numContractKindRef == 2 ? 0 : contract.numPersonelHomeSalary), contract.dateStartContractDate, numContractKindref, array, 1));
        //            int bon = Convert.ToInt32(GetMandeHoghoghForCutWork(personelcode, Convert.ToInt32(contract.numContractKindRef == 3 || contract.numContractKindRef == 2 ? 0 : contract.numPersonelBon), contract.dateStartContractDate, numContractKindref, array, 1));

        //            int AyabZahab = Convert.ToInt32(GetAyabZahabCutWork(personelcode, CheckIsNUll(contract.numPriceAyabZahab, 0), contract.dateStartContractDate, array, numContractKindref, 1));
        //            int haghmodiriat = Convert.ToInt32(GetHaghModiriatCutWork(personelcode, CheckIsNUll(contract.numPriceHaghModiriat, 0), contract.dateStartContractDate, array, numContractKindref, 1));

        //            int mah31roz = Convert.ToInt32(GetPriceMonth29Or31CutWork(personelcode, (int)(contract.numPersonelSalary  ), contract.dateStartContractDate, array, numContractKindref, 1, 1));
        //            int hagholad = Convert.ToInt32(GetMandeHoghoghForCutWork(personelcode, Convert.ToInt32(contract.numContractKindRef == 3 || contract.numContractKindRef == 2 ? 0 : contract.numPersonelChildSalary), contract.dateStartContractDate, numContractKindref, array, 1));
        //            int sanavat = Convert.ToInt32(GetMandeHoghoghForCutWork(personelcode, Convert.ToInt32(contract.numPersonelSanavat), contract.dateStartContractDate, numContractKindref, array, 1));

        //            if (type == 1)
        //                ret = Math.Round(Convert.ToDouble(hoghogh + padashamalkard + haghmaskan + sanavat + bon + AyabZahab + haghmodiriat + mah31roz + hagholad)).ToString();
        //            else if (type == 2)
        //                ret = Convert.ToInt32(Math.Round(Convert.ToDouble(hoghogh))).ToString() + "-" +
        //                  Convert.ToInt32(Math.Round(Convert.ToDouble(haghmaskan))).ToString() + "-" +
        //                  Convert.ToInt32(Math.Round(Convert.ToDouble(bon))).ToString() + "-" +
        //                  Convert.ToInt32(Math.Round(Convert.ToDouble(padashamalkard))).ToString() + "-" +
        //                  Convert.ToInt32(Math.Round(Convert.ToDouble(sanavat))).ToString() + "-" +
        //                  Convert.ToInt32(Math.Round(Convert.ToDouble(hagholad))).ToString() + "-" +
        //                  Convert.ToInt32(Math.Round(Convert.ToDouble(mah31roz))).ToString() + "-" +
        //                  Convert.ToInt32(Math.Round(Convert.ToDouble(haghmodiriat))).ToString() + "-" +
        //                  Convert.ToInt32(Math.Round(Convert.ToDouble(AyabZahab))).ToString();

        //        }
        //    }
        //    else
        //    {
        //        ret = "0";
        //    }
        //}
        //else if (numContractKindref == 2)
        //{
        //    var checkpricesaati = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numPersonelRef == personelcode && c.strInvoiceYear == year.ToString() && c.strInvoiceMonth == month.ToString()).FirstOrDefault();
        //    if (checkpricesaati == null)
        //    {
        //        ret = "0";
        //    }
        //    else
        //    {
        //        ret = "0";
        //    }
        //}
        string datecutwork = GetPriceAndDateFromArray(personelcode, arrayCutWork, 2);
        ret = GetMandeHoghoghAzMaheGhabl(personelcode, year, month, datecutwork, type, 1);

        return ret;
    }
    //---------------------------------------------------------------------
    //---------------------------محاسبه مساعده قطع همکاری----------------
    //---------------------------------------------------------------------
    public int GetPriceMosaedeCutWork(int personelcode, int contractkindref)
    {
        int ret = 0;
        int month = 0;
        int year = 0;
        if (contractkindref == 1 || contractkindref == 3)
        {
            var karkard = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobCode).Take(1).FirstOrDefault();
            month = Convert.ToInt32(karkard.numMonthJob);
            year = Convert.ToInt32(karkard.numYear);
        }
        else if (contractkindref == 2)
        {
            var karkardsaati = office.ofcPersonelMonthlyJobSaatis.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobSaatiCode).Take(1).FirstOrDefault();
            month = Convert.ToInt32(karkardsaati.numMonthJob);
            year = Convert.ToInt32(karkardsaati.numYear);
        }

        ret = GetPriceMosaede(personelcode, year, month);

        return ret;
    }
    //---------------------------------------------------------------------------
    //---------------------محاسبه بدون حقوق قطع همکاری-------------------------
    //---------------------------------------------------------------------------
    public string GetPriceMorakhasiBiHoghoghCutWork(int price, int personelcode)
    {
        string ret = "0";

        var karkard = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobCode).Take(1).FirstOrDefault();
        if (karkard != null)
        {
            ret = GetPriceMorakhasiBiHoghogh(price, personelcode, karkard.numMonthJob.ToString(), karkard.numYear.ToString());
        }
        return ret;
    }
    //---------------------------------------------------------------------
    //--------------------دریافت مانده مرخصی -----------------------------
    //---------------------------------------------------------------------
    public string GetMandeMorakhasi(int personelcode, string dateStartContractDate, string dateCutWorkDate, int contractkindref, string Year, string month, int bazkharid)
    {
        string result = "0";
        if (contractkindref == 1 || contractkindref == 3)
        {
            result = GetMorakhasiFish(personelcode, month, Year.ToString(), dateStartContractDate, dateCutWorkDate, 10).Replace("روز", "").Trim();
        }
        else if (contractkindref == 2)
        {
            string checkis = bazkharid > 0 ? "true" : "false";
            result = GetPriceBazkharidMorakhasi(personelcode, 0, contractkindref, checkis, dateCutWorkDate, 2, Year, 0);
            if (result != "0")
                result = result.Split('^')[4];
        }
        return result;
    }
    //---------------------------------------------------------------------------
    //-----------------------دریافت مرخصی فیش حقوقی---------------------------
    //---------------------------------------------------------------------------
    public string GetMorakhasiFish(int personelcode, string month, string year, string dateStartContractDate, string dateCutWorkDate, int type)
    {
        string ret = "";
        if (type == 1) // estilaji saati 
        {
            var qMorakhasi = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == personelcode && c.numYear == Convert.ToInt16(year) && c.numMonth == Convert.ToInt16(month) && c.numLeaveRef == 1 && (new int[] { 3 }).Contains((int)c.numStatus)).FirstOrDefault();
            if (qMorakhasi != null)
            {
                if (!String.IsNullOrEmpty(qMorakhasi.timeLeaveTime))
                    ret = qMorakhasi.timeLeaveTime + " ساعت ";
                else
                    ret = "00:00 ساعت";
            }
            else
            {
                ret = "00:00 ساعت";
            }
        }
        else if (type == 2) // estilaji rozaneh 
        {
            var qMorakhasi = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == personelcode && c.numYear == Convert.ToInt16(year) && c.numMonth == Convert.ToInt16(month) && c.numLeaveRef == 2 && (new int[] { 3 }).Contains((int)c.numStatus)).FirstOrDefault();
            if (qMorakhasi != null)
            {
                if (!String.IsNullOrEmpty(qMorakhasi.timeLeaveTime))
                    ret = Math.Round((decimal)(((Convert.ToDouble(qMorakhasi.timeLeaveTime.Split(':')[0]) / 8) + ((Convert.ToDouble(qMorakhasi.timeLeaveTime.Split(':')[1]) / 60) / 8))), 2).ToString() + " روز";
                else
                    ret = "0 روز";
            }
            else
            {
                ret = "0 روز";
            }
        }
        else if (type == 3) // ezdevaj fot
        {
            var qMorakhasi = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == personelcode && c.numYear == Convert.ToInt16(year) && c.numMonth == Convert.ToInt16(month) && c.numLeaveRef == 3 && (new int[] { 3 }).Contains((int)c.numStatus)).FirstOrDefault();
            if (qMorakhasi != null)
            {
                if (!String.IsNullOrEmpty(qMorakhasi.timeLeaveTime))
                    ret = Math.Round((decimal)(((Convert.ToDouble(qMorakhasi.timeLeaveTime.Split(':')[0]) / 8) + ((Convert.ToDouble(qMorakhasi.timeLeaveTime.Split(':')[1]) / 60) / 8))), 2).ToString() + " روز";
                else
                    ret = "0 روز";
            }
            else
            {
                ret = "0 روز";
            }

        }
        else if (type == 4) // estehghaghi saati 
        {
            var qMorakhasi = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == personelcode && c.numYear == Convert.ToInt16(year) && c.numMonth == Convert.ToInt16(month) && c.numLeaveRef == 4 && (new int[] { 3 }).Contains((int)c.numStatus)).FirstOrDefault();
            if (qMorakhasi != null)
            {
                if (!String.IsNullOrEmpty(qMorakhasi.timeLeaveTime))
                    ret = qMorakhasi.timeLeaveTime + " ساعت ";
                else
                    ret = "00:00 ساعت";
            }
            else
            {
                ret = "00:00 ساعت";
            }
        }
        else if (type == 5) // estehghaghi rozaneh 
        {
            var qMorakhasi = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == personelcode && c.numYear == Convert.ToInt16(year) && c.numMonth == Convert.ToInt16(month) && c.numLeaveRef == 5 && (new int[] { 3 }).Contains((int)c.numStatus)).FirstOrDefault();
            if (qMorakhasi != null)
            {
                if (!String.IsNullOrEmpty(qMorakhasi.timeLeaveTime))
                    ret = Math.Round((decimal)(((Convert.ToDouble(qMorakhasi.timeLeaveTime.Split(':')[0]) / 8) + ((Convert.ToDouble(qMorakhasi.timeLeaveTime.Split(':')[1]) / 60) / 8))), 2).ToString() + " روز";
                else
                    ret = "0 روز";
            }
            else
            {
                ret = "0 روز";
            }
        }
        else if (type == 6) // bi hoghogh saati 
        {
            var qMorakhasi = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == personelcode && c.numYear == Convert.ToInt16(year) && c.numMonth == Convert.ToInt16(month) && c.numLeaveRef == 6 && (new int[] { 3 }).Contains((int)c.numStatus)).FirstOrDefault();
            if (qMorakhasi != null)
            {
                if (!String.IsNullOrEmpty(qMorakhasi.timeLeaveTime))
                    ret = qMorakhasi.timeLeaveTime + " ساعت ";
                else
                    ret = "00:00 ساعت";
            }
            else
            {
                ret = "00:00 ساعت";
            }
        }
        else if (type == 7) // bi hoghogh rozaneh 
        {
            var qMorakhasi = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == personelcode && c.numYear == Convert.ToInt16(year) && c.numMonth == Convert.ToInt16(month) && c.numLeaveRef == 7 && (new int[] { 3 }).Contains((int)c.numStatus)).FirstOrDefault();
            if (qMorakhasi != null)
            {
                if (!String.IsNullOrEmpty(qMorakhasi.timeLeaveTime))
                    ret = Math.Round((decimal)(((Convert.ToDouble(qMorakhasi.timeLeaveTime.Split(':')[0]) / 8) + ((Convert.ToDouble(qMorakhasi.timeLeaveTime.Split(':')[1]) / 60) / 8))), 2).ToString() + " روز";
                else
                    ret = "0 روز";
            }
            else
            {
                ret = "0 روز";
            }
        }
        else if (type == 8) //daneshjoi saati 
        {
            var qMorakhasi = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == personelcode && c.numYear == Convert.ToInt16(year) && c.numMonth == Convert.ToInt16(month) && c.numLeaveRef == 12 && (new int[] { 3 }).Contains((int)c.numStatus)).FirstOrDefault();
            if (qMorakhasi != null)
            {
                if (!String.IsNullOrEmpty(qMorakhasi.timeLeaveTime))
                    ret = qMorakhasi.timeLeaveTime + " ساعت ";
                else
                    ret = "00:00 ساعت";
            }
            else
            {
                ret = "00:00 ساعت";
            }
        }
        else if (type == 9) // daneshjoi rozaneh 
        {
            var qMorakhasi = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == personelcode && c.numYear == Convert.ToInt16(year) && c.numMonth == Convert.ToInt16(month) && c.numLeaveRef == 13 && (new int[] { 3 }).Contains((int)c.numStatus)).FirstOrDefault();
            if (qMorakhasi != null)
            {
                if (!String.IsNullOrEmpty(qMorakhasi.timeLeaveTime))
                    ret = Math.Round((decimal)(((Convert.ToDouble(qMorakhasi.timeLeaveTime.Split(':')[0]) / 8) + ((Convert.ToDouble(qMorakhasi.timeLeaveTime.Split(':')[1]) / 60) / 8))), 2).ToString() + " روز";
                else
                    ret = "0 روز";
            }
            else
            {
                ret = "0 روز";
            }
        }
        else if (type == 10) // saliane
        {
            DateTime Date1 = Convert.ToDateTime(office.UDF_Julian_To_Gregorian(office.UDF_Persian_To_Julian(Convert.ToInt32(dateStartContractDate.Split('/')[0]), Convert.ToInt32(dateStartContractDate.Split('/')[1]), Convert.ToInt32(dateStartContractDate.Split('/')[2]))));
            DateTime Date2 = Convert.ToDateTime(office.UDF_Julian_To_Gregorian(office.UDF_Persian_To_Julian(Convert.ToInt32(dateCutWorkDate.Split('/')[0]), Convert.ToInt32(dateCutWorkDate.Split('/')[1]), Convert.ToInt32(dateCutWorkDate.Split('/')[2]))));
            //decimal yekmahmorakhasi = Math.Round((decimal)(Convert.ToDouble(26) / 12), 2);
            int months = (Date2.Year - Date1.Year) * 12 + Date2.Month - Date1.Month;
            double sumMorakhsi = Convert.ToDouble(Math.Round((decimal)((Convert.ToDouble(26) / 12) * months), 2));

            var qsaliane = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == personelcode && c.numYear == Convert.ToInt16(year) && (c.numMonth >= Convert.ToInt32(dateStartContractDate.Split('/')[1]) && c.numMonth <= Convert.ToInt32(month)) && (new int[] { 4, 5 }).Contains((int)c.numLeaveRef) && (new int[] { 3 }).Contains((int)c.numStatus));

            if (qsaliane.Count() > 0)
            {
                double sumTime = 0;
                foreach (var item in qsaliane)
                {
                    sumTime = sumTime + Convert.ToDouble(Math.Round((decimal)(Convert.ToDouble(item.timeLeaveTime.Split(':')[0])), 2) + Math.Round((decimal)((Convert.ToDouble(item.timeLeaveTime.Split(':')[1]) / Convert.ToDouble(60))), 2));
                }

                ret = Math.Round((decimal)(Convert.ToDouble(sumMorakhsi) - (sumTime / 8)), 2).ToString() + " روز";
            }
            else
            {
                ret = sumMorakhsi.ToString() + " روز";
            }
        }
        return ret;
    }
    //----------------------------------------------------------------------
    //---------------------دریافت مانده حقوق قطع همکاری-------------------
    //----------------------------------------------------------------------
    public string GetMandeHoghoghForCutWork(int personelcode, int price, string datestart, int ContractKindRef, string arrayCutWork, int type)
    {
        string result = "0";
        if (price > 0)
        {
            string dateRet = GetPriceAndDateFromArray(personelcode, arrayCutWork, 2);
            //string DarCutWork = dateRet.Split('/')[2].Trim();
            int checkRun = 0;
            string year = "";
            string month = "";

            if (ContractKindRef == 1 || ContractKindRef == 3)
            {
                var karkard = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobCode).Take(1).FirstOrDefault();
                if (karkard != null)
                {
                    checkRun = 1;
                    year = karkard.numYear.ToString();
                    month = karkard.numMonthJob.ToString();
                }
            }
            else if (ContractKindRef == 2)
            {
                var karkardsaati = office.ofcPersonelMonthlyJobSaatis.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobSaatiCode).Take(1).FirstOrDefault();
                if (karkardsaati != null)
                    result = GetPriceKarkardSaati(karkardsaati.strJobTime, price, 1).ToString();

            }
            if (checkRun > 0)
            {
                if (ContractKindRef == 1 || ContractKindRef == 3)
                {
                    var PriceMonth = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month && c.strInvoiceYear == year).FirstOrDefault();
                    if (PriceMonth != null)
                        result = "0";
                    else
                        result = GetPriceKarkard(price, datestart, Convert.ToInt32(year), Convert.ToInt32(month), dateRet, 1, personelcode).ToString();
                }
            }
        }
        return result;
    }
    //----------------------------------------------------------------------
    //----------------دریافت مانده حقوق قطع همکاری 2----------------------
    //----------------------------------------------------------------------
    public string GetMandeHoghoghForCutWork1(int personelcode, int price, string datestart, int contrackkind, string arrayCutWork)
    {
        string result = "0";
        if (contrackkind == 2)
            result = "0";
        else
        {
            string dateRet = GetPriceAndDateFromArray(personelcode, arrayCutWork, 2);
            string DarCutWork = dateRet.Split('/')[2].Trim();
            var karkard = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobCode).Take(1).FirstOrDefault();
            if (karkard != null)
            {
                if (contrackkind == 1 || contrackkind == 3)
                {
                    var PriceMonth = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == karkard.numMonthJob.ToString() && c.strInvoiceYear == karkard.numYear.ToString()).FirstOrDefault();
                    if (PriceMonth != null)
                        result = "0";
                    else
                    {
                        if (contrackkind == 1)
                            result = GetPriceKarkard(price, datestart, (int)karkard.numYear, (int)karkard.numMonthJob, dateRet, 1, personelcode).ToString();
                        else if (contrackkind == 3)
                        {
                            var check = office.ofcPersonelFaraiands.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0 && c.numMonthJob == karkard.numMonthJob && c.numYear == karkard.numYear);
                            if (check.Any())
                            {
                                result = (Convert.ToInt32(check.Sum(c => c.numCountFaraiandProject)) * price).ToString();
                            }
                        }
                    }
                }

            }
        }
        return result;
    }
    //---------------------------------------------------------------------------
    //----------------------دریافت زمان کارکرد فیش حقوقی-----------------------
    //---------------------------------------------------------------------------
    public class rptkarkardTime
    {
        public string strJobOverTime { get; set; }
        public string strJobFriday { get; set; }
        public string strJobHoliDay { get; set; }
        public string strJobMission { get; set; }
        public string strJobDelay { get; set; }
        public string strJobEarly { get; set; }
        public string strJobAbsent { get; set; }
        public string strJobExit { get; set; }
        public int numMonthlyJobCode { get; set; }
        public string strJobOverTimeSpecial { get; set; }
        public string strJobOverTimeInMission { get; set; }
        public int numYear { get; set; }
        public int numMonthJob { get; set; }
    }
    public string GetTimeKarkard(int personelcode, string month, string year, int numMonthlyJobRef, int contractcode, int type, int iscutwork)
    {
        string ret = "0";
        if (String.IsNullOrEmpty(month)) month = "0";
        if (String.IsNullOrEmpty(year)) year = "0";
        List<rptkarkardTime> karkard = new List<rptkarkardTime>();
        List<rptkarkardTime> lstkarkard2 = new List<rptkarkardTime>();

        int numcontractkindref = Convert.ToInt32(office.ofcPersonelContracts.Where(c => c.numPersonelRef == personelcode && c.numContractCode == contractcode).FirstOrDefault().numContractKindRef);
        if (numcontractkindref == 1 || numcontractkindref == 3)
        {
            lstkarkard2 = (from c in office.ofcPersonelMonthlyJobs
                           where
                               c.numPersonelRef == personelcode
                               &&
                               c.numContractRef == contractcode
                               &&
                              (
                              ((iscutwork == 0 || iscutwork == 1) && c.numMonthJob == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(year) && c.numMonthlyJobCode == numMonthlyJobRef)
                              ||
                              (iscutwork == 2 && c.numStatus == 0)
                              )
                           select new rptkarkardTime
                           {
                               strJobOverTime = c.strJobOverTime,
                               strJobFriday = c.strJobFriday,
                               strJobHoliDay = c.strJobHoliDay,
                               strJobMission = c.strJobMission,
                               strJobDelay = c.strJobDelay,
                               strJobEarly = c.strJobEarly,
                               strJobAbsent = c.strJobAbsent,
                               strJobExit = c.strJobExit,
                               numMonthlyJobCode = c.numMonthlyJobCode,
                               strJobOverTimeSpecial = c.strJobOverTimeSpecial,
                               strJobOverTimeInMission = c.strJobOverTimeInMission,
                               numYear = Convert.ToInt32(c.numYear),
                               numMonthJob = Convert.ToInt32(c.numMonthJob)
                           }).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobCode).Take(1).ToList();
        }
        else if (numcontractkindref == 2) //saati
        {
            lstkarkard2 = (from c in office.ofcPersonelMonthlyJobSaatis
                           where
                               c.numPersonelRef == personelcode
                               &&
                               c.numContractRef == contractcode
                               &&
                              (
                              ((iscutwork == 0 || iscutwork == 1) && c.numMonthJob == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(year) && c.numMonthlyJobSaatiCode == numMonthlyJobRef)
                              ||
                              (iscutwork == 2 && c.numStatus == 0)
                              )
                           select new rptkarkardTime
                           {
                               strJobOverTime = c.strJobTime,
                               strJobFriday = "0",
                               strJobHoliDay = "0",
                               strJobMission = "0",
                               strJobDelay = "0",
                               strJobEarly = "0",
                               strJobAbsent = "0",
                               strJobExit = "0",
                               numMonthlyJobCode = c.numMonthlyJobSaatiCode,
                               strJobOverTimeSpecial = "0",
                               strJobOverTimeInMission = "0",
                               numYear = Convert.ToInt32(c.numYear),
                               numMonthJob = Convert.ToInt32(c.numMonthJob)
                           }).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobCode).Take(1).ToList();
        }

        if (iscutwork == 1 || iscutwork == 2)
        {
            karkard = lstkarkard2.OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).Take(1).ToList();
        }
        else
            karkard = lstkarkard2.Take(1).ToList();

        if (type == 1) // ezafe kar
            ret = karkard.FirstOrDefault() == null ? "00:00" : karkard.FirstOrDefault().strJobOverTime;
        else if (type == 2) // jome kar
            ret = karkard.FirstOrDefault() == null ? "00:00" : karkard.FirstOrDefault().strJobFriday;
        else if (type == 3) // tatilkar
            ret = karkard.FirstOrDefault() == null ? "00:00" : karkard.FirstOrDefault().strJobHoliDay;
        else if (type == 4) // mamoriat
            ret = karkard.FirstOrDefault() == null ? "0" : karkard.FirstOrDefault().strJobMission;
        else if (type == 5) // takhir
            ret = karkard.FirstOrDefault() == null ? "00:00" : karkard.FirstOrDefault().strJobDelay;
        else if (type == 6) // tajil
            ret = karkard.FirstOrDefault() == null ? "00:00" : karkard.FirstOrDefault().strJobEarly;
        else if (type == 7) // ghibat
            ret = karkard.FirstOrDefault() == null ? "0" : karkard.FirstOrDefault().strJobAbsent;
        else if (type == 8) // khoroj ghire mojaz
            ret = karkard.FirstOrDefault() == null ? "00:00" : karkard.FirstOrDefault().strJobExit;
        else if (type == 9)  // morakhasi bi hoghogh
        {
            ret = "0";
            var q = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == personelcode && c.numMonth == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(year) && (new int[] { 6, 7 }).Contains((int)c.numLeaveRef) && (new int[] { 1, 2 }).Contains((int)c.numStatus));
            if (q.Count() > 0)
            {
                string Saati = q.Where(c => c.numLeaveRef == 6).FirstOrDefault() != null ? q.Where(c => c.numLeaveRef == 6).FirstOrDefault().timeLeaveTime : "00:00";
                string rozane = q.Where(c => c.numLeaveRef == 7).FirstOrDefault() != null ? q.Where(c => c.numLeaveRef == 7).FirstOrDefault().timeLeaveTime : "00:00";
                decimal RozSaati = Math.Round((decimal)(((Convert.ToDouble(Saati.Split(':')[0]) / 8) + ((Convert.ToDouble(Saati.Split(':')[1]) / 60) / 8))), 2);
                decimal TimeRozane = Math.Round((decimal)(((Convert.ToDouble(rozane.Split(':')[0]) / 8) + ((Convert.ToDouble(rozane.Split(':')[1]) / 60) / 8))), 2);
                decimal kol = TimeRozane + RozSaati;
                ret = kol.ToString();
            }
        }
        else if (type == 10)  // morakhasi daneshjoie
        {
            ret = "0";
            var q = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == personelcode && c.numMonth == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(year) && (new int[] { 12, 13 }).Contains((int)c.numLeaveRef) && (new int[] { 1, 2 }).Contains((int)c.numStatus));
            if (q.Count() > 0)
            {
                string Saati = q.Where(c => c.numLeaveRef == 12).FirstOrDefault() != null ? q.Where(c => c.numLeaveRef == 12).FirstOrDefault().timeLeaveTime : "00:00";
                string rozane = q.Where(c => c.numLeaveRef == 13).FirstOrDefault() != null ? q.Where(c => c.numLeaveRef == 13).FirstOrDefault().timeLeaveTime : "00:00";
                decimal RozSaati = Math.Round((decimal)(((Convert.ToDouble(Saati.Split(':')[0]) / 8) + ((Convert.ToDouble(Saati.Split(':')[1]) / 60) / 8))), 2);
                decimal TimeRozane = Math.Round((decimal)(((Convert.ToDouble(rozane.Split(':')[0]) / 8) + ((Convert.ToDouble(rozane.Split(':')[1]) / 60) / 8))), 2);
                decimal kol = TimeRozane + RozSaati;
                ret = kol.ToString();
            }
        }
        else if (type == 11) // ezafe kar vijeh
            ret = karkard.FirstOrDefault() == null ? "00:00" : karkard.FirstOrDefault().strJobOverTimeSpecial;
        else if (type == 12) // ezafe kar dar mamoriat
            ret = karkard.FirstOrDefault() == null ? "00:00" : karkard.FirstOrDefault().strJobOverTimeInMission;
        return ret;
    }
    //----------------------------------------------------------------------
    //-------------------------دریافت پاداش یا جریمه قطع همکاری-----------
    //----------------------------------------------------------------------
    public int GetPadashAndJarimehCutWork(int personelcode, int numContractKindRef, int savekind, string datecutwork)
    {
        int ret = 0;
        int month = 0;
        int year = 0;
        int checkRun = 0;
        if (numContractKindRef == 1 || numContractKindRef == 3)
        {
            var karkard = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobCode).Take(1).FirstOrDefault();
            if (karkard != null)
            {
                month = Convert.ToInt16(karkard.numMonthJob);
                year = Convert.ToInt16(karkard.numYear);
                checkRun = 1;
            }
            else if (datecutwork != "")
            {
                year = Convert.ToInt16(datecutwork.Split('/')[0]);
                month = Convert.ToInt16(datecutwork.Split('/')[1]);
                checkRun = 1;
            }
        }
        else if (numContractKindRef == 2)
        {
            var karkardsaati = office.ofcPersonelMonthlyJobSaatis.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobSaatiCode).Take(1).FirstOrDefault();
            if (karkardsaati != null)
            {
                month = Convert.ToInt16(karkardsaati.numMonthJob);
                year = Convert.ToInt16(karkardsaati.numYear);
                checkRun = 1;
            }
            else if (datecutwork != "")
            {
                year = Convert.ToInt16(datecutwork.Split('/')[0]);
                month = Convert.ToInt16(datecutwork.Split('/')[1]);
                checkRun = 1;
            }
        }

        if (checkRun > 0)
        {
            ret = GetPadashAndJarimeh(personelcode, savekind, month, year, 0);
        }

        return ret;
    }
    //---------------------------------------------------------------------------
    //---------------------------دریافت شماره بیمه-----------------------------
    //---------------------------------------------------------------------------
    public string GetnumberBimeh(int personelcode)
    {
        string ret = "";
        var check = office.ofcPersonelBimehs.Where(c => c.numPersonelRef == personelcode && c.numStatus == 2 && (c.dateEndBimehDate == "" || c.dateEndBimehDate == null)).FirstOrDefault();
        if (check != null)
            ret = check.strBimehNumber;
        else
            ret = "-";
        return ret;
    }
    //---------------------------------------------------------------------------
    //--------------------------دریافت توضیحات فیش حقوقی-----------------------
    //---------------------------------------------------------------------------
    public string GetDesc(int personelcode, string month, string year, int monthlyJobref, string mandeazmahghabl, int numContractKindRef, string dateStartContractDate, string dateCutWorkDate, int type)
    {
        string ret = "";

        DateTime Date1 = Convert.ToDateTime(office.UDF_Julian_To_Gregorian(office.UDF_Persian_To_Julian(Convert.ToInt32(dateStartContractDate.Split('/')[0]), Convert.ToInt32(dateStartContractDate.Split('/')[1]), Convert.ToInt32(dateStartContractDate.Split('/')[2]))));
        DateTime Date2 = Convert.ToDateTime(office.UDF_Julian_To_Gregorian(office.UDF_Persian_To_Julian(Convert.ToInt32(dateCutWorkDate.Split('/')[0]), Convert.ToInt32(dateCutWorkDate.Split('/')[1]), Convert.ToInt32(dateCutWorkDate.Split('/')[2]))));
        //decimal yekmahmorakhasi = Math.Round((decimal)(Convert.ToDouble(26) / 12), 2);
        int months = (Date2.Year - Date1.Year) * 12 + Date2.Month - Date1.Month;

        if (type == 1)
        {
            var karkard = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == personelcode && c.numMonthlyJobCode == monthlyJobref && c.numMonthJob == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(year)).FirstOrDefault();
            ret = "محاسبه کارکرد (ورود و خروج) از تاریخ " + karkard.dateStartJobDate + " تا تاریخ " + karkard.dateEndJobDate + "  و اصل حقوق طبق توافق در قرارداد می باشد.";
            ret = ret + "\n مانده مرخصی سال جاری بر حسب قرارداد " + months.ToString() + " ماهه می باشد.";
        }
        else if (type == 2)
        {
            var karkard = office.ofcPersonelMonthlyJobSaatis.Where(c => c.numPersonelRef == personelcode && c.numMonthlyJobSaatiCode == monthlyJobref && c.numMonthJob == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(year)).FirstOrDefault();
            ret = "محاسبه کارکرد (ورود و خروج) از تاریخ " + karkard.dateStartJobDate + " تا تاریخ " + karkard.dateEndJobDate + "  و اصل حقوق طبق توافق در قرارداد می باشد.";
        }
        var checkPadashAndJarimeh = office.ofcPersonelPadashAndJarimehs.Where(c => c.numPersonelRef == personelcode && c.numMonth == Convert.ToInt32(month) && c.numYear == Convert.ToInt32(year) && c.numStatus == 1);

        if (checkPadashAndJarimeh.Any())
        {
            ret = ret + "\n";
            foreach (var itempadash in checkPadashAndJarimeh.Where(c => c.numSaveKind == 1))
            {
                ret = ret + "مبلغ " + string.Format("{0:#,###0}", Convert.ToInt32(itempadash.numPricePadashAndJarimeh)) + " ریال پاداش بابت " + itempadash.strDesc + " پرداخت شد.\n";
            }
            foreach (var itempadash in checkPadashAndJarimeh.Where(c => c.numSaveKind == 2))
            {
                ret = ret + "مبلغ " + string.Format("{0:#,###0}", Convert.ToInt32(itempadash.numPricePadashAndJarimeh)) + " ریال جریمه بابت " + itempadash.strDesc + " کسر شد.\n";
            }
            foreach (var itempadash in checkPadashAndJarimeh.Where(c => c.numSaveKind == 3))
            {
                ret = ret + "مبلغ " + string.Format("{0:#,###0}", Convert.ToInt32(itempadash.numPricePadashAndJarimeh)) + " ریال معوقه بابت " + itempadash.strDesc + " پرداخت شد.\n";
            }
            foreach (var itempadash in checkPadashAndJarimeh.Where(c => c.numSaveKind == 4))
            {
                ret = ret + "مبلغ " + string.Format("{0:#,###0}", Convert.ToInt32(itempadash.numPricePadashAndJarimeh)) + " ریال خرید از شرکت بابت " + itempadash.strDesc + " کسر شد.\n";
            }
            foreach (var itempadash in checkPadashAndJarimeh.Where(c => c.numSaveKind == 5))
            {
                ret = ret + "مبلغ " + string.Format("{0:#,###0}", Convert.ToInt32(itempadash.numPricePadashAndJarimeh)) + " ریال کسور متفرقه بابت " + itempadash.strDesc + " کسر شد.\n";
            }
            foreach (var itempadash in checkPadashAndJarimeh.Where(c => c.numSaveKind == 6))
            {
                ret = ret + "مبلغ " + string.Format("{0:#,###0}", Convert.ToInt32(itempadash.numPricePadashAndJarimeh)) + " ریال کمک ایاب ذهاب بابت " + itempadash.strDesc + " پرداخت شد.\n";
            }
        }

        string MandeHoghogh = "0";
        MandeHoghogh = mandeazmahghabl;

        if (MandeHoghogh != "0")
        {
            ret = ret + "\n خالص حقوق مانده از ماه قبل شامل : \n";
            string ret2 = "", ret3 = "";
            string[] arrayMandeHoghogh = MandeHoghogh.Split('-').Where(c => !String.IsNullOrEmpty(c)).ToArray();

            if (arrayMandeHoghogh[0] != "" && Convert.ToInt32(arrayMandeHoghogh[0]) > 0)
                ret2 = ret2 + "حقوق ثابت : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[0])) + "{txt}";
            if (arrayMandeHoghogh[1] != "" && Convert.ToInt32(arrayMandeHoghogh[1]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "کمک هزینه مسکن : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[1])) + "{txt}";
            }
            if (arrayMandeHoghogh[2] != "" && Convert.ToInt32(arrayMandeHoghogh[2]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "بن خوار و بار : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[2])) + "{txt}";
            }
            if (arrayMandeHoghogh[3] != "" && Convert.ToInt32(arrayMandeHoghogh[3]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "پاداش عملکرد : " + (numContractKindRef == 3 ? "0" : string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[3]))) + "{txt}";
            }
            if (arrayMandeHoghogh[4] != "" && Convert.ToInt32(arrayMandeHoghogh[4]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "حق سنوات : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[4])) + "{txt}";
            }
            if (arrayMandeHoghogh[5] != "" && Convert.ToInt32(arrayMandeHoghogh[5]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "حق اولاد : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[5])) + "{txt}";
            }
            if (arrayMandeHoghogh[6] != "" && Convert.ToInt32(arrayMandeHoghogh[6]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "جبران کارکرد ماه 31 روزه : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[6])) + "{txt}";
            }
            if (arrayMandeHoghogh[7] != "" && Convert.ToInt32(arrayMandeHoghogh[7]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "حق مسئولیت : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[7])) + "{txt}";
            }
            if (arrayMandeHoghogh[8] != "" && Convert.ToInt32(arrayMandeHoghogh[8]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "حق ایاب و ذهاب : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[8])) + "{txt}";
            }

            if (arrayMandeHoghogh[9] != "" && Convert.ToInt32(arrayMandeHoghogh[9]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "پاداش : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[9])) + "{txt}";
            }

            if (arrayMandeHoghogh[10] != "" && Convert.ToInt32(arrayMandeHoghogh[10]) > 0)
            {
                ret2 = ret2 + "معوقه : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[10])) + "{txt}";
            }

            ret2 = ret2 != "" ? "پرداختی : " + ret2.Replace("{txt}", " ریال می باشد. \n") : "";


            if (arrayMandeHoghogh[11] != "" && Convert.ToInt32(arrayMandeHoghogh[11]) > 0)
            {
                ret3 = ret3 + "جریمه : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[11])) + "{txt}";
            }

            if (arrayMandeHoghogh[12] != "" && Convert.ToInt32(arrayMandeHoghogh[12]) > 0)
            {
                ret3 = ret3 != "" ? ret3.Replace("{txt}", " ریال و ") : "";
                ret3 = ret3 + "خرید از شرکت : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[12])) + "{txt}";
            }
            if (arrayMandeHoghogh[13] != "" && Convert.ToInt32(arrayMandeHoghogh[13]) > 0)
            {
                ret3 = ret3 != "" ? ret3.Replace("{txt}", " ریال و ") : "";
                ret3 = ret3 + "کسور متفرقه : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[13])) + "{txt}";
            }
            if (arrayMandeHoghogh[14] != "" && Convert.ToInt32(arrayMandeHoghogh[14]) > 0)
            {
                ret3 = ret3 != "" ? ret3.Replace("{txt}", " ریال و ") : "";
                ret3 = ret3 + "کسر کارکرد ماه 29 روزه : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[14])) + "{txt}";
            }

            if (arrayMandeHoghogh[15] != "" && Convert.ToInt32(arrayMandeHoghogh[15]) > 0)
            {
                ret3 = ret3 != "" ? ret3.Replace("{txt}", " ریال و ") : "";
                ret3 = ret3 + "مالیات حقوق : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[15])) + "{txt}";
            }

            if (arrayMandeHoghogh[16] != "" && Convert.ToInt32(arrayMandeHoghogh[16]) > 0)
            {
                ret3 = ret3 != "" ? ret3.Replace("{txt}", " ریال و ") : "";
                ret3 = ret3 + "بیمه تکمیلی : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[16])) + "{txt}";
            }

            if (arrayMandeHoghogh[17] != "" && Convert.ToInt32(arrayMandeHoghogh[17]) > 0)
            {
                ret3 = ret3 != "" ? ret3.Replace("{txt}", " ریال و ") : "";
                ret3 = ret3 + "حق بیمه : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[17])) + "{txt}";
            }

            if (arrayMandeHoghogh[18] != "" && Convert.ToInt32(arrayMandeHoghogh[18]) > 0)
            {
                ret3 = ret3 != "" ? ret3.Replace("{txt}", " ریال و ") : "";
                ret3 = ret3 + "وام : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[18])) + "{txt}";
            }

            if (arrayMandeHoghogh[19] != "" && Convert.ToInt32(arrayMandeHoghogh[19]) > 0)
            {
                ret3 = ret3 != "" ? ret3.Replace("{txt}", " ریال و ") : "";
                ret3 = ret3 + "مساعده : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[19])) + "{txt}";
            }



            ret3 = ret3 != "" ? "کسورات : " + ret3.Replace("{txt}", " ریال می باشد. ") : "";
            ret = ret + ret2 + ret3;

        }
        //*************************************
        string info = GetAllAmvalInfo(personelcode, 2);
        if (info != "")
        {
            string price = Convert.ToInt32(PriceAmvalPersonel(personelcode, 3)).ToString("#,##0");
            ret = ret + "\n" + info + "\n که اموال ذکر شده در بالا ، مجموعاً به مبلغ " + price + " ریال می باشد";
        }


        return ret;

    }
    //---------------------------------------------------------------------------
    //---------------------دریافت توضیحات قطع همکاری---------------------------
    //---------------------------------------------------------------------------
    public string GetDescCutWork(int personelcode, int numContractKindRef, int year, int month, string mandeazmahghabl)
    {
        string ret = "";


        var checkPadashAndJarimeh = office.ofcPersonelPadashAndJarimehs.Where(c => c.numPersonelRef == personelcode && c.numMonth == month && c.numYear == year && c.numStatus == 0);

        if (checkPadashAndJarimeh.Any())
        {
            ret = ret + "\n";
            foreach (var itempadash in checkPadashAndJarimeh.Where(c => c.numSaveKind == 1))
            {
                ret = ret + "مبلغ " + string.Format("{0:#,###0}", Convert.ToInt32(itempadash.numPricePadashAndJarimeh)) + " ریال پاداش بابت " + itempadash.strDesc + " پرداخت شد.\n";
            }
            foreach (var itempadash in checkPadashAndJarimeh.Where(c => c.numSaveKind == 2))
            {
                ret = ret + "مبلغ " + string.Format("{0:#,###0}", Convert.ToInt32(itempadash.numPricePadashAndJarimeh)) + " ریال جریمه بابت " + itempadash.strDesc + " کسر شد.\n";
            }
            foreach (var itempadash in checkPadashAndJarimeh.Where(c => c.numSaveKind == 3))
            {
                ret = ret + "مبلغ " + string.Format("{0:#,###0}", Convert.ToInt32(itempadash.numPricePadashAndJarimeh)) + " ریال معوقه بابت " + itempadash.strDesc + " پرداخت شد.\n";
            }
            foreach (var itempadash in checkPadashAndJarimeh.Where(c => c.numSaveKind == 4))
            {
                ret = ret + "مبلغ " + string.Format("{0:#,###0}", Convert.ToInt32(itempadash.numPricePadashAndJarimeh)) + " ریال خرید از شرکت بابت " + itempadash.strDesc + " کسر شد.\n";
            }
            foreach (var itempadash in checkPadashAndJarimeh.Where(c => c.numSaveKind == 5))
            {
                ret = ret + "مبلغ " + string.Format("{0:#,###0}", Convert.ToInt32(itempadash.numPricePadashAndJarimeh)) + " ریال کسور متفرقه بابت " + itempadash.strDesc + " کسر شد.\n";
            }
            foreach (var itempadash in checkPadashAndJarimeh.Where(c => c.numSaveKind == 6))
            {
                ret = ret + "مبلغ " + string.Format("{0:#,###0}", Convert.ToInt32(itempadash.numPricePadashAndJarimeh)) + " ریال کمک ایاب ذهاب بابت " + itempadash.strDesc + " پرداخت شد.\n";
            }
        }


        string MandeHoghogh = "0";
        MandeHoghogh = mandeazmahghabl;

        if (MandeHoghogh != "0")
        {
            ret = ret + "\n خالص حقوق مانده از ماه قبل شامل : \n";
            string ret2 = "", ret3 = "";
            string[] arrayMandeHoghogh = MandeHoghogh.Split('-').Where(c => !String.IsNullOrEmpty(c)).ToArray();

            if (arrayMandeHoghogh[0] != "" && Convert.ToInt32(arrayMandeHoghogh[0]) > 0)
                ret2 = ret2 + "حقوق ثابت : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[0])) + "{txt}";
            if (arrayMandeHoghogh[1] != "" && Convert.ToInt32(arrayMandeHoghogh[1]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "کمک هزینه مسکن : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[1])) + "{txt}";
            }
            if (arrayMandeHoghogh[2] != "" && Convert.ToInt32(arrayMandeHoghogh[2]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "بن خوار و بار : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[2])) + "{txt}";
            }
            if (arrayMandeHoghogh[3] != "" && Convert.ToInt32(arrayMandeHoghogh[3]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "پاداش عملکرد : " + (numContractKindRef == 3 ? "0" : string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[3]))) + "{txt}";
            }
            if (arrayMandeHoghogh[4] != "" && Convert.ToInt32(arrayMandeHoghogh[4]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "حق سنوات : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[4])) + "{txt}";
            }
            if (arrayMandeHoghogh[5] != "" && Convert.ToInt32(arrayMandeHoghogh[5]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "حق اولاد : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[5])) + "{txt}";
            }
            if (arrayMandeHoghogh[6] != "" && Convert.ToInt32(arrayMandeHoghogh[6]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "جبران کارکرد ماه 31 روزه : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[6])) + "{txt}";
            }
            if (arrayMandeHoghogh[7] != "" && Convert.ToInt32(arrayMandeHoghogh[7]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "حق مسئولیت : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[7])) + "{txt}";
            }
            if (arrayMandeHoghogh[8] != "" && Convert.ToInt32(arrayMandeHoghogh[8]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "حق ایاب و ذهاب : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[8])) + "{txt}";
            }

            if (arrayMandeHoghogh[9] != "" && Convert.ToInt32(arrayMandeHoghogh[9]) > 0)
            {
                ret2 = ret2 != "" ? ret2.Replace("{txt}", " ریال و ") : "";
                ret2 = ret2 + "پاداش : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[9])) + "{txt}";
            }

            if (arrayMandeHoghogh[10] != "" && Convert.ToInt32(arrayMandeHoghogh[10]) > 0)
            {
                ret2 = ret2 + "معوقه : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[10])) + "{txt}";
            }

            ret2 = ret2 != "" ? "پرداختی : " + ret2.Replace("{txt}", " ریال می باشد. \n") : "";


            if (arrayMandeHoghogh[11] != "" && Convert.ToInt32(arrayMandeHoghogh[11]) > 0)
            {
                ret3 = ret3 + "جریمه : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[11])) + "{txt}";
            }

            if (arrayMandeHoghogh[12] != "" && Convert.ToInt32(arrayMandeHoghogh[12]) > 0)
            {
                ret3 = ret3 != "" ? ret3.Replace("{txt}", " ریال و ") : "";
                ret3 = ret3 + "خرید از شرکت : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[12])) + "{txt}";
            }
            if (arrayMandeHoghogh[13] != "" && Convert.ToInt32(arrayMandeHoghogh[13]) > 0)
            {
                ret3 = ret3 != "" ? ret3.Replace("{txt}", " ریال و ") : "";
                ret3 = ret3 + "کسور متفرقه : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[13])) + "{txt}";
            }
            if (arrayMandeHoghogh[14] != "" && Convert.ToInt32(arrayMandeHoghogh[14]) > 0)
            {
                ret3 = ret3 != "" ? ret3.Replace("{txt}", " ریال و ") : "";
                ret3 = ret3 + "کسر کارکرد ماه 29 روزه : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[14])) + "{txt}";
            }

            if (arrayMandeHoghogh[15] != "" && Convert.ToInt32(arrayMandeHoghogh[15]) > 0)
            {
                ret3 = ret3 != "" ? ret3.Replace("{txt}", " ریال و ") : "";
                ret3 = ret3 + "مالیات حقوق : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[15])) + "{txt}";
            }

            if (arrayMandeHoghogh[16] != "" && Convert.ToInt32(arrayMandeHoghogh[16]) > 0)
            {
                ret3 = ret3 != "" ? ret3.Replace("{txt}", " ریال و ") : "";
                ret3 = ret3 + "بیمه تکمیلی : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[16])) + "{txt}";
            }

            if (arrayMandeHoghogh[17] != "" && Convert.ToInt32(arrayMandeHoghogh[17]) > 0)
            {
                ret3 = ret3 != "" ? ret3.Replace("{txt}", " ریال و ") : "";
                ret3 = ret3 + "حق بیمه : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[17])) + "{txt}";
            }

            if (arrayMandeHoghogh[18] != "" && Convert.ToInt32(arrayMandeHoghogh[18]) > 0)
            {
                ret3 = ret3 != "" ? ret3.Replace("{txt}", " ریال و ") : "";
                ret3 = ret3 + "وام : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[18])) + "{txt}";
            }

            if (arrayMandeHoghogh[19] != "" && Convert.ToInt32(arrayMandeHoghogh[19]) > 0)
            {
                ret3 = ret3 != "" ? ret3.Replace("{txt}", " ریال و ") : "";
                ret3 = ret3 + "مساعده : " + string.Format("{0:#,###0}", Convert.ToInt32(arrayMandeHoghogh[19])) + "{txt}";
            }



            ret3 = ret3 != "" ? "کسورات : " + ret3.Replace("{txt}", " ریال می باشد. ") : "";
            ret = ret + ret2 + ret3;

        }

        return ret;

    }
    //---------------------------------------------------------------------------
    //------------------------دریافت مبلغ دستمزدها فیش حقوقی-------------------
    //---------------------------------------------------------------------------
    public string GetDastmozdha(int Price, int numconractkindref, int type)
    {
        string ret = "0";
        if (numconractkindref == 1 || numconractkindref == 3)
        {
            double priceRozane = Math.Round(Convert.ToDouble(Price) / Convert.ToDouble(30));
            double priceSaati = priceRozane / Convert.ToDouble(7.33);
            if (type == 1) //dastmozd rozane karkard -- rozane
                ret = priceRozane.ToString();
            else if (type == 2)//mozd ezafe kar and ezafe kar vijeh and ezafe kar dar mamoriat -- saati
                ret = (Math.Round(priceSaati * Convert.ToDouble(1.4))).ToString();
            else if (type == 3)//mozd jomekar -- saati
                ret = (Math.Round(priceSaati * Convert.ToDouble(1.8))).ToString();
            else if (type == 4)//mozd tatilkar -- saati
                ret = (Math.Round(priceSaati * Convert.ToDouble(1.4))).ToString();
            else if (type == 5)//mozd mamoriat -- saati
                ret = (priceRozane).ToString();
            else if (type == 6)//jarimeh takhir -- saati
                ret = (Math.Round(priceSaati * Convert.ToDouble(1.4))).ToString();
            else if (type == 7)//jarimeh tajil -- saati
                ret = (Math.Round(priceSaati * Convert.ToDouble(1.4))).ToString();
            else if (type == 8)//jarimeh ghibat -- rozane
                ret = (Math.Round((Convert.ToDouble(Price) / Convert.ToDouble(30)) * Convert.ToDouble(2))).ToString();
            else if (type == 9)//mozd saati  -- saati
                ret = (Math.Round(priceSaati)).ToString();
            else if (type == 10)//jarimeh khoroj ghier mojaz  --  saati
                ret = (Math.Round(priceSaati * Convert.ToDouble(1.4))).ToString();
            else if (type == 11) // jarime morakhisi bedone hoghogh
                ret = (Math.Round(priceRozane)).ToString();
            else if (type == 12) // jarime morakhisi daneshjoi
                ret = (Math.Round(priceRozane)).ToString();
        }
        else if (numconractkindref == 2)
        {
            if (type == 1)
                ret = "0";
            else if (type == 9)
                ret = Price.ToString();
        }
        return ret;
    }
    //---------------------------------------------------------------------------
    //------------------------مرخصی بدون حقوق قطع همکاری-----------------------
    //---------------------------------------------------------------------------
    public string GetPriceMorakhasiUniversalCutWork(int price, int personelcode)
    {
        string ret = "0";
        var karkard = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).OrderByDescending(c => c.numYear).ThenByDescending(c => c.numMonthJob).ThenByDescending(c => c.numMonthlyJobCode).Take(1).FirstOrDefault();
        if (karkard != null)
        {
            ret = GetPriceMorakhasiUniversal(price, personelcode, karkard.numMonthJob.ToString(), karkard.numYear.ToString());
        }
        return ret;
    }
    //---------------------------------------------------------------------------
    //------------------------محاسبه مبلغ ایاب و ذهاب--------------------------
    //---------------------------------------------------------------------------
    public int GetAyabZahab(int personelcode, int priceAyabzahab, int year, int month, string datestart, string dateend, int iscutwork)
    {
        int ret = 0;
        int sumAyabZahab = GetPadashAndJarimeh(personelcode, 6, month, year, 0);
        // ret = priceAyabzahab + sumAyabZahab;
        ret = GetPriceKarkard(CheckIsNUll(priceAyabzahab, 0), datestart, year, month, dateend, iscutwork, personelcode);
        ret = ret + sumAyabZahab;
        return ret;
    }
    //---------------------------------------------------------------------------
    //------------------------محاسبه مبلغ حق مسئولیت--------------------------
    //---------------------------------------------------------------------------
    public int GetHaghModiriat(int personelcode, int pricemodiriat, int year, int month, string datestart, string dateend, int iscutwork)
    {
        int ret = 0;
        ret = GetPriceKarkard(CheckIsNUll(pricemodiriat, 0), datestart, year, month, dateend, iscutwork, personelcode);
        return ret;
    }
    //---------------------------------------------------------------------------
    //------------------------محاسبه مبلغ هزینه جاری--------------------------
    //---------------------------------------------------------------------------
    public int GetHazinehJari(int personelcode, int priceAboGaz, int priceEjareh, int priceNet, int priceTel, int year, int month, string datestart, string dateend, int iscutwork)
    {
        int ret = 0;

        ret = GetPriceKarkard(CheckIsNUll(priceAboGaz, 0), datestart, year, month, dateend, iscutwork, personelcode);
        ret = ret + GetPriceKarkard(CheckIsNUll(priceEjareh, 0), datestart, year, month, dateend, iscutwork, personelcode);
        ret = ret + GetPriceKarkard(CheckIsNUll(priceNet, 0), datestart, year, month, dateend, iscutwork, personelcode);
        ret = ret + GetPriceKarkard(CheckIsNUll(priceTel, 0), datestart, year, month, dateend, iscutwork, personelcode);

        return ret;
    }
    //---------------------------------------------------------------------------
    //------------------------محاسبه مبلغ پورسانت نمایندگی--------------------------
    //---------------------------------------------------------------------------
    public int GetPorsantPriceAgent(int personelcode, int pricePorsant, int year, int month, string datestart, string dateend, int iscutwork, int type)
    {
        // type 
        //1: tozi
        //2:kharejmahdode,
        //3:moadeli
        int ret = 0;
        //if (pricePorsant > 0)
        //{
        //    pltdDataContext pltd = new pltdDataContext(func.setapcstr);
        //    var Agent = pltd.agcPersons.Where(c => c.numOfcPersonelRef == personelcode).FirstOrDefault();

        //    if (Agent != null)
        //    {
        //        string agentcode = Agent.strPersonMelliCode.Trim();
        //        string DateFrom = "", DateTo = "";
        //        string[] arrayDateStart = datestart.Split('/');
        //        if (Convert.ToInt32(arrayDateStart[0]) == year && Convert.ToInt32(arrayDateStart[1]) == month)
        //        {
        //            DateFrom = datestart;
        //            DateTo = year.ToString() + "/" + (month.ToString().Length == 1 ? "0" + month.ToString() : month.ToString()) + "/20";
        //            DateTo = iscutwork == 0 ? DateTo : dateend;
        //        }
        //        else
        //        {
        //            DateTo = year.ToString() + "/" + (month.ToString().Length == 1 ? "0" + month.ToString() : month.ToString()) + "/20";
        //            DateTo = iscutwork == 0 ? DateTo : dateend;
        //            if (month == 1)
        //            {
        //                month = 12;
        //                year = year - 1;
        //            }
        //            else
        //            {
        //                month = month - 1;
        //            }
        //            DateFrom = year.ToString() + "/" + (month.ToString().Length == 1 ? "0" + month.ToString() : month.ToString()) + "/21";
        //        }
        //        if (type == 1) // porsant tozi shode
        //        {
        //            var q = (from t in pltd.wsOrders
        //                     join t1 in pltd.agcPersonOrders on t.strOrderCode equals t1.strOrderRef
        //                     where
        //                     t1.strPersonMelliRef.Trim() == agentcode
        //                     &&
        //                     (string.Compare(t.dateReformDate, DateFrom) >= 0 && string.Compare(t.dateReformDate, DateTo) <= 0)
        //                     &&
        //                     t.numOrderBOrderStatusRef == 39
        //                     select new
        //                     {
        //                         t.strOrderCode
        //                     }).Distinct();

        //            int countorder = q.Count();

        //            ret = countorder * pricePorsant;
        //        }
        //        else if (type == 2)
        //        {
        //            var q = (from t in pltd.agcVarianceOrders
        //                     where t.strPersonMelliRef.Trim() == agentcode
        //                           &&
        //                           (string.Compare(t.dateRegisterDate, DateFrom) >= 0 && string.Compare(t.dateRegisterDate, DateTo) <= 0)
        //                           &&
        //                           t.numStatus == 49 // پورسانتی خارج محدوده
        //                     select new
        //                     { t.strOrderRef }).Distinct();
        //            int countorder = q.Count();
        //            ret = countorder * pricePorsant;
        //        }
        //        else if (type == 3)
        //        {
        //            var q = (from t in pltd.agcBalanceOrders
        //                     where
        //                          t.strPersonMelliRef.Trim() == agentcode
        //                          &&
        //                          (string.Compare(t.dateRegisterDate, DateFrom) >= 0 && string.Compare(t.dateRegisterDate, DateTo) <= 0)
        //                     select new
        //                     { t.strNewOrderCode }).Distinct();
        //            int countorder = q.Count();
        //            ret = countorder * pricePorsant;
        //        }
        //    }
        //}
        return ret;
    }
    //---------------------------------------------------------------------------
    //--------محاسبه مبلغ اضافه ماه 31 روزه یا کسر ماه 29 روزه----------------
    //---------------------------------------------------------------------------
    public int GetPriceMonth29Or31(int personelcode, int pricesalary, int year, int month, string datestart, string dateend, int contractkind, int iscutwork, int type)
    {
        int ret = 0;
        if (contractkind == 1)
        {
            double PriceKol = 0;
            var dayInMonth = (from t in office.ofcDayWorkIntoMonths
                              where
                                   t.numMonthJob == month
                                   &&
                                   t.numYear == year
                              select new
                              {
                                  t.numCountDay
                              }).FirstOrDefault();

            if (dayInMonth != null && ((type == 1 && dayInMonth.numCountDay == 31) || (type == 2 && dayInMonth.numCountDay == 29)))
            {
                if (iscutwork == 1) // ghate hamkari bod
                {
                    string[] arrayDateStart = datestart.Split('/');
                    int dayKarkard = 0;
                    if (Convert.ToInt32(arrayDateStart[0]) == year && Convert.ToInt32(arrayDateStart[1]) == month)
                    {
                        dayKarkard = (Convert.ToInt32(dateend.Split('/')[2]) - Convert.ToInt32(arrayDateStart[2])) + 1;

                        if (((type == 1 && dayKarkard == 31) || (type == 2 && dayKarkard == 29)))
                        {
                            PriceKol = (Convert.ToDouble(pricesalary) / Convert.ToDouble(30)) * Convert.ToDouble(1);
                            ret = Convert.ToInt32(Math.Round(PriceKol));
                        }
                    }
                    else if (((type == 1 && Convert.ToInt32(dateend.Split('/')[2]) == 31) || (type == 2 && Convert.ToInt32(dateend.Split('/')[2]) == 29)))
                    {

                        PriceKol = (Convert.ToDouble(pricesalary) / Convert.ToDouble(30)) * Convert.ToDouble(1);
                        ret = Convert.ToInt32(Math.Round(PriceKol));
                    }
                }
                else
                {
                    PriceKol = (Convert.ToDouble(pricesalary) / Convert.ToDouble(30)) * Convert.ToDouble(1);
                    ret = Convert.ToInt32(Math.Round(PriceKol));
                }
            }
        }
        return ret;
    }
    //---------------------------------------------------------------------------
    //------------------------جریمه تاخیر بیش از 8 ساعت--------------------------
    //---------------------------------------------------------------------------
    public int GetJarimehTakhir8Houer(int personelcode, string karkard, int? price1, int type, int contractcode, int iscutwork)
    {
        int ret = 0;

        if (price1 > 0)
        {
            if (iscutwork == 1)
                karkard = GetTimeKarkard(personelcode, "", "", 0, contractcode, type, 2);

            int price = Convert.ToInt32(price1);

            double result = GetDayTakhir8Houer(karkard);// Convert.ToDouble((Convert.ToDouble(karkard.Split(':')[0])) + ((Convert.ToDouble(karkard.Split(':')[1]) / 60)));
            if (result > 0)
            {
                ret = Convert.ToInt32(Convert.ToDouble(result) * Convert.ToDouble((price / 30) * 2)); // ghibat
            }
        }
        return ret;
    }
    //---------------------------------------------------------------------------
    //---------------------------------------------------------------------------
    //---------------------------------------------------------------------------
    public double GetDayTakhir8Houer(string karkard)
    {
        double req = 0;
        double result = Convert.ToDouble((Convert.ToDouble(karkard.Split(':')[0])) + ((Convert.ToDouble(karkard.Split(':')[1]) / 60)));
        if (result >= 8)
        {
            req = Math.Floor(result / 8);
        }
        return req;
    }

    //---------------------------------------------------------------------------
    //------------------------ایاب و ذهاب قطع همکاری--------------------------
    //---------------------------------------------------------------------------
    public string GetAyabZahabCutWork(int personelcode, int price, string datestart, string datecutwork, string year, string month, int ContractKindRef, int iscutwork)
    {
        string ret = "0";
        if (price > 0)
        {
            // string datecutwork = GetPriceAndDateFromArray(personelcode, arrayCutWork, 2);
            // string YearMali = GetPriceAndDateFromArray(personelcode, arrayCutWork, 5);

            //=============================================

            if (ContractKindRef == 1 || ContractKindRef == 3)
            {
                var PriceMonth = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month && c.strInvoiceYear == year).FirstOrDefault();
                if (PriceMonth != null)
                    ret = "0";
                else
                    ret = GetAyabZahab(personelcode, price, Convert.ToInt32(year), Convert.ToInt32(month), datestart, datecutwork, 1).ToString();
            }
            else if (ContractKindRef == 2)
            {
                var PriceMonthsaati = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month && c.strInvoiceYear == year).FirstOrDefault();
                if (PriceMonthsaati != null)
                    ret = "0";
                else
                    ret = GetAyabZahab(personelcode, price, Convert.ToInt32(year), Convert.ToInt32(month), datestart, datecutwork, 1).ToString();
            }


        }

        return ret;
    }
    //---------------------------------------------------------------------------
    //------------------------حق مدیریت قطع همکاری------------------------------
    //---------------------------------------------------------------------------
    public string GetHaghModiriatCutWork(int personelcode, int price, string datestart, string year, string month, string datecutwork, int ContractKindRef, int iscutwork)
    {
        string ret = "0";
        int ret10 = 0;
        if (price > 0)
        {
            // string datecutwork = GetPriceAndDateFromArray(personelcode, arrayCutWork, 2);
            //string YearMali = GetPriceAndDateFromArray(personelcode, arrayCutWork, 5);

            if (ContractKindRef == 1 || ContractKindRef == 3)
            {
                var PriceMonth = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month && c.strInvoiceYear == year).FirstOrDefault();
                if (PriceMonth != null)
                    ret = "0";
                else
                    ret = GetHaghModiriat(personelcode, price, Convert.ToInt32(year), Convert.ToInt32(month), datestart, datecutwork, 1).ToString();

                ret10 = GetPriceKarkard10roz(price, datestart,Convert.ToInt32( year), Convert.ToInt32(month), datecutwork, iscutwork, personelcode);

                ret = (Convert.ToInt32(ret) + ret10).ToString();

            }
            else if (ContractKindRef == 2)
            {
                var PriceMonthsaati = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month && c.strInvoiceYear == year).FirstOrDefault();
                if (PriceMonthsaati != null)
                    ret = "0";
                else
                    ret = GetHaghModiriat(personelcode, price, Convert.ToInt32(year), Convert.ToInt32(month), datestart, datecutwork, 1).ToString();
            }

        }


        return ret;
    }
    //---------------------------------------------------------------------------
    //------------------------هزینه جاری قطع همکاری----------------------------
    //---------------------------------------------------------------------------
    public string GetHazinehJariCutWork(int personelcode, int priceAboGaz, int priceEjareh, int priceNet, int priceTel, string datestart, string datecutwork, string year, string month, int ContractKindRef, int iscutwork)
    {
        string ret = "0";

        if ((priceAboGaz + priceEjareh + priceNet + priceTel) > 0)
        {
            // string datecutwork = GetPriceAndDateFromArray(personelcode, arrayCutWork, 2);
            // string YearMali = GetPriceAndDateFromArray(personelcode, arrayCutWork, 5);
            if (ContractKindRef == 1 || ContractKindRef == 3)
            {
                var PriceMonth = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month && c.strInvoiceYear == year).FirstOrDefault();
                if (PriceMonth != null)
                    ret = "0";
                else
                    ret = GetHazinehJari(personelcode, priceAboGaz, priceEjareh, priceNet, priceTel, Convert.ToInt32(year), Convert.ToInt32(month), datestart, datecutwork, 1).ToString();
            }
            else if (ContractKindRef == 2)
            {
                var PriceMonthsaati = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month && c.strInvoiceYear == year).FirstOrDefault();
                if (PriceMonthsaati != null)
                    ret = "0";
                else
                    ret = GetHazinehJari(personelcode, priceAboGaz, priceEjareh, priceNet, priceTel, Convert.ToInt32(year), Convert.ToInt32(month), datestart, datecutwork, 1).ToString();
            }

        }


        return ret;
    }
    //---------------------------------------------------------------------------
    //-------------محاسبه مبلغ پورسانت نمایندگی قطع همکاری--------------------
    //---------------------------------------------------------------------------
    public string GetPorsantPriceAgentCutWork(int personelcode, int price, string datestart, string datecutwork, string year, string month, int ContractKindRef, int iscutwork, int type)
    {
        string ret = "0";
        if (price > 0)
        {
            //string datecutwork = GetPriceAndDateFromArray(personelcode, arrayCutWork, 2);
            //string YearMali = GetPriceAndDateFromArray(personelcode, arrayCutWork, 5);


            if (ContractKindRef == 1 || ContractKindRef == 3)
            {
                var PriceMonth = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month && c.strInvoiceYear == year).FirstOrDefault();
                if (PriceMonth != null)
                    ret = "0";
                else
                    ret = GetPorsantPriceAgent(personelcode, price, Convert.ToInt32(year), Convert.ToInt32(month), datestart, datecutwork, iscutwork, type).ToString();
            }
            else if (ContractKindRef == 2)
            {
                var PriceMonthsaati = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month && c.strInvoiceYear == year).FirstOrDefault();
                if (PriceMonthsaati != null)
                    ret = "0";
                else
                    ret = GetPorsantPriceAgent(personelcode, price, Convert.ToInt32(year), Convert.ToInt32(month), datestart, datecutwork, iscutwork, type).ToString();
            }

        }


        return ret;
    }
    //---------------------------------------------------------------------------
    //----محاسبه مبلغ اضافه ماه 31 روزه یا کسر ماه 29 روزه قطع همکاری--------
    //---------------------------------------------------------------------------
    public string GetPriceMonth29Or31CutWork(int personelcode, int price, string datestart, string datecutwork, string year, string month, int ContractKindRef, int iscutwork, int type)
    {
        string ret = "0";
        if (price > 0)
        {
            //string datecutwork = GetPriceAndDateFromArray(personelcode, arrayCutWork, 2);
            //string YearMali = GetPriceAndDateFromArray(personelcode, arrayCutWork, 5);

            if (ContractKindRef == 1)
            {
                var PriceMonth = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month && c.strInvoiceYear == year).FirstOrDefault();
                if (PriceMonth != null)
                    ret = "0";
                else
                    ret = GetPriceMonth29Or31(personelcode, price, Convert.ToInt32(year), Convert.ToInt32(month), datestart, datecutwork, ContractKindRef, iscutwork, type).ToString();
            }
            else if (ContractKindRef == 3 || ContractKindRef == 2)
            {
                ret = "0";
                //var PriceMonthsaati = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month && c.strInvoiceYear == year).FirstOrDefault();
                //if (PriceMonthsaati != null)
                //    ret = "0";
                //else
                //    ret = GetPriceMonth29Or31(personelcode, price, Convert.ToInt32(year), Convert.ToInt32(month), datestart, datecutwork, iscutwork, type).ToString();
            }

        }


        return ret;
    }
    //---------------------------------------------------------------------------
    //----محاسبه مبلغ جریمه تاهیر قطع همکاری--------
    //---------------------------------------------------------------------------
    public string GetJarimehTakhir8HouerCutWork(int personelcode, int price, string datestart, string datecutwork, string year, string month, int ContractKindRef, int contractcode, int type, int iscutwork)
    {
        string ret = "0";
        if (price > 0)
        {
            //string datecutwork = GetPriceAndDateFromArray(personelcode, arrayCutWork, 2);
            //string YearMali = GetPriceAndDateFromArray(personelcode, arrayCutWork, 5);


            if (ContractKindRef == 1 || ContractKindRef == 3)
            {
                var PriceMonth = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month && c.strInvoiceYear == year).FirstOrDefault();
                if (PriceMonth != null)
                    ret = "0";
                else
                    ret = GetJarimehTakhir8Houer(personelcode, "", price, type, contractcode, iscutwork).ToString();
            }
            else if (ContractKindRef == 2)
            {
                var PriceMonthsaati = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numPersonelRef == personelcode && c.strInvoiceMonth == month && c.strInvoiceYear == year).FirstOrDefault();
                if (PriceMonthsaati != null)
                    ret = "0";
                else
                    ret = GetJarimehTakhir8Houer(personelcode, "", price, type, contractcode, iscutwork).ToString();
            }

        }


        return ret;
    }

    //----------------------------------------------------------------------
    //----------------------------------------------------------------------
    //----------------------------------------------------------------------


}