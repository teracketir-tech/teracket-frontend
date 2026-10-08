import { useState, useEffect, useCallback } from "react";
import { DateObject } from "react-multi-date-picker";

import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import DefaultDay from "./days/DefaultDay";
import SingleDayView from "./days/SingleDayView";
import EventDayModal from "./EventDayModal";
import { cn, formatDateToEn, formatDateToFa, formatNumber, monthNames, weekDays } from "@/lib/utils";
import { useFormik } from "formik";
import { api } from "@/lib/axios";
import gregorian from "react-date-object/calendars/gregorian";
import FilterForm from "@/components/pages/accounting-data/calendar/Filter";
interface DayInfo {
    dayNumber: number;
    isCurrentMonth: boolean;
    persianDate: string;
    gregorianDate: string;
    weekDayName: string;
    fullPersianDate: DateObject;
}

type SelectedTab = "day" | "week" | "month";

export default function CalendarPreview() {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, SetSelectedDate] = useState<any>({});
    const [daysMatrix, setDaysMatrix] = useState<DayInfo[][]>([]);
    const [accountingItems, setAccountingItems] = useState<any>({});
    const [selectedTab, setselectedTab] = useState<SelectedTab>("month");
    const [currentDate, setCurrentDate] = useState(new DateObject({ calendar: persian, locale: persian_fa }));
    const [selectedDay, setSelectedDay] = useState(new DateObject({ calendar: persian, locale: persian_fa }).day);

    const realToday = new DateObject({ calendar: persian, locale: persian_fa });

    const tabs = [
        { value: "day", label: "روز" },
        { value: "week", label: "هفته" },
        { value: "month", label: "ماه" },
    ];

    const formik = useFormik({
        initialValues: {
            company_id: "",
            accounting_data_id: "",
            description: "",
        },
        onSubmit,
        validationSchema: false,
    });

    function onSubmit(data: any) {
        let { year, month } = currentDate;

        if (data?.date) {
            const date = new DateObject({
                date: data.date,
                calendar: gregorian,
            }).convert(persian, persian_fa);

            setCurrentDate(date);

            setselectedTab("day");
        }

        const start = formatDateToEn(`${year}/${month.number}/1`);
        const end = formatDateToEn(`${year}/${month.number}/${month.length}`);

        fetchAccountingItems(
            `${data.company_id ? `company_id=${data.company_id}&` : ""}date=${start},${end}${data.accounting_data_id ? `&accounting_data_id=${data.accounting_data_id}` : ""}`,
        );
    }

    const fetchAccountingItems = async (query?: string) => {
        setLoading(true);

        const res = await api(
            `accounting-item/calendar${query ? `?${query}&` : "?"}expand=company, accountingData, accounting, accounting.items, contact`,
            "GET",
        );

        setAccountingItems(res);
        setLoading(false);
    };

    const getWeekDayName = (date: DateObject) => {
        const idx = date.weekDay.index % 7;

        return weekDays[idx];
    };

    const getFirstDayIndex = (date: DateObject) => {
        const firstDay = new DateObject({
            calendar: persian,
            locale: persian_fa,
            year: date.year,
            month: date.month.index + 1,
            day: 1,
        });

        return firstDay.weekDay.index % 7;
    };

    const generateMonthDays = useCallback(() => {
        const firstDayIndex = getFirstDayIndex(currentDate);

        const daysInMonth = currentDate.month.length;

        const allDays: DayInfo[] = [];

        // خانه های خالی اول ماه
        for (let i = 0; i < firstDayIndex; i++) {
            allDays.push({
                dayNumber: 0,
                isCurrentMonth: false,
                persianDate: "",
                gregorianDate: "",
                weekDayName: "",
                fullPersianDate: new DateObject(),
            });
        }

        // روزهای ماه
        for (let i = 1; i <= daysInMonth; i++) {
            const pDate = new DateObject({
                calendar: persian,
                locale: persian_fa,
                year: currentDate.year,
                month: currentDate.month.index + 1,
                day: i,
            });

            allDays.push({
                dayNumber: i,
                isCurrentMonth: true,
                persianDate: formatDateToFa(pDate),
                gregorianDate: formatDateToEn(pDate),
                weekDayName: getWeekDayName(pDate),
                fullPersianDate: new DateObject(pDate),
            });
        }

        // تکمیل جدول
        while (allDays.length % 7 !== 0) {
            allDays.push({
                dayNumber: 0,
                isCurrentMonth: false,
                persianDate: "",
                gregorianDate: "",
                weekDayName: "",
                fullPersianDate: new DateObject(),
            });
        }

        const matrix: DayInfo[][] = [];

        for (let i = 0; i < allDays.length; i += 7) {
            matrix.push(allDays.slice(i, i + 7));
        }

        setDaysMatrix(matrix);
    }, [currentDate]);

    useEffect(() => {
        generateMonthDays();
    }, [generateMonthDays]);

    useEffect(() => {
        formik.submitForm();
    }, [currentDate.month.index]);

    const handlePrev = () => {
        formik.setFieldValue("date", "");

        if (selectedTab === "day") {
            const newDate = new DateObject(currentDate).subtract(1, "day");

            setCurrentDate(newDate);

            setSelectedDay(newDate.day);
        } else if (selectedTab === "week") {
            const newDate = new DateObject(currentDate).subtract(7, "day");

            setCurrentDate(newDate);

            setSelectedDay(newDate.day);
        } else {
            const newDate = new DateObject(currentDate).subtract(1, "month");

            setCurrentDate(newDate);

            setSelectedDay(1);
        }
    };

    const handleNext = () => {
        formik.setFieldValue("date", "");

        if (selectedTab === "day") {
            const newDate = new DateObject(currentDate).add(1, "day");

            setCurrentDate(newDate);

            setSelectedDay(newDate.day);
        } else if (selectedTab === "week") {
            const newDate = new DateObject(currentDate).add(7, "day");

            setCurrentDate(newDate);

            setSelectedDay(newDate.day);
        } else {
            const newDate = new DateObject(currentDate).add(1, "month");

            setCurrentDate(newDate);

            setSelectedDay(1);
        }
    };

    const handleDayClick = (day: DayInfo) => {
        if (!day.isCurrentMonth) return;

        setSelectedDay(day.dayNumber);

        setCurrentDate(day.fullPersianDate);
    };

    const changeYear = (year: number) => {
        formik.setFieldValue("date", "");

        setCurrentDate(
            new DateObject({
                calendar: persian,
                locale: persian_fa,
                year,
                month: currentDate.month.index + 1,
                day: selectedDay,
            }),
        );
    };

    const changeMonthBySelect = (month: number) => {
        formik.setFieldValue("date", "");

        setCurrentDate(
            new DateObject({
                calendar: persian,
                locale: persian_fa,
                year: currentDate.year,
                month,
                day: 1,
            }),
        );

        setSelectedDay(1);
    };

    const handleSelectDate = (date: any) => {
        SetSelectedDate(date);
        setShowModal(true);
    };

    const currentEvents = (date: string) => {
        return accountingItems?.data
            ?.filter((ai: any) => ai?.accounting?.date == date)
            .map((a: any) => {
                const price = Math.abs(Number(a.credit) - Number(a.debit));

                return {
                    price,
                    id: a.id,
                    title: a.description,
                    pay_items: a.pay_items,
                    accounting: a.accounting,
                    is_original: a.is_original,
                    description: a.full_description,
                    contact: a?.contact?.alias || "",
                    accounting_data_id: a.accounting_data_id,
                    side_accounting_data: a.side_accounting_data,
                    accountingData: a?.accounting_data?.title || "",
                    side_accounting_data_detail: a.side_accounting_data_detail,
                    color: a.accounting_data_id == 14 ? "bg-green-100" : "bg-red-100",
                };
            });
    };

    const isHoliday = (day: any) => day.weekDayName === "جمعه";

    const monthOptions = monthNames.map((m: string, i: number) => ({ label: m, value: (i + 1).toString() }));
    const yearOptions = Array.from({ length: 30 }, (_, i) => ({ label: 1390 + i, value: (1390 + i).toString() }));

    const monthTotal = accountingItems?.data
        ?.filter((i: any) => i.is_original)
        ?.reduce((acc: number, item: any) => {
            const price = Math.abs(Number(item.credit) - Number(item.debit));

            if (item.accounting_data_id == 14) return acc + price;
            return acc - price;
        }, 0);

    const handleGoToDate = (d: any, dd: any) => {
        const date = new DateObject({
            date: d,
            calendar: gregorian,
        }).convert(persian, persian_fa);

        SetSelectedDate(dd);
        setCurrentDate(date);
        setselectedTab("day");
        setShowModal(false);
    };

    return (
        <>
            <div className="p-4">
                <FilterForm
                    formik={formik}
                    loading={loading}
                    currentDate={currentDate}
                    monthOptions={monthOptions}
                    yearOptions={yearOptions}
                    changeMonthBySelect={changeMonthBySelect}
                    changeYear={changeYear}
                    fetchAccountingItems={fetchAccountingItems}
                />

                {/* tabs */}
                <div className="my-6 flex gap-4 justify-center items-center">
                    <button onClick={handlePrev} className="cursor-pointer px-4 py-2 text-white bg-primary rounded-md">
                        قبلی
                    </button>

                    <div className="flex gap-1 bg-gray-100 p-2 rounded-lg">
                        {tabs.map((tab: any) => (
                            <button
                                key={tab.value}
                                onClick={() => setselectedTab(tab.value)}
                                className={cn(
                                    "cursor-pointer px-4 py-2 rounded text-sm font-medium transition-all duration-200",
                                    selectedTab === tab.value ? "bg-white text-primary shadow-md" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200",
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <button onClick={handleNext} className="cursor-pointer px-4 py-2 text-white bg-primary rounded-md">
                        بعدی
                    </button>
                </div>

                <div className="w-full relative">
                    <h2 className="text-xl font-bold text-center mb-4">
                        {monthNames[currentDate.month.index]} {currentDate.year}
                    </h2>
                    <div className="absolute left-1 top-0.5 bg-gree">
                        <div className="flex items-center gap-2">
                            <p>جمع کل ماه</p>
                            <p>:</p>
                            <p className={cn(monthTotal > 0 ? "text-green-500" : "text-red-500")}>{formatNumber(monthTotal || 0, true)}</p>
                        </div>
                    </div>
                </div>

                {selectedTab !== "day" && (
                    <table className="w-full">
                        <thead>
                            <tr className="w-full grid grid-cols-7 bg-gray-100">
                                {weekDays.map((day) => (
                                    <th key={day} className="border border-gray-300 p-3 text-center">
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {selectedTab === "month"
                                ? daysMatrix.map((week, weekIndex) => (
                                      <tr key={weekIndex} className="w-full grid grid-cols-7">
                                          {week.map((day, dayIndex) => (
                                              <td
                                                  key={dayIndex}
                                                  onClick={() => handleDayClick(day)}
                                                  className={cn(
                                                      "p-1.5 border border-gray-300  cursor-pointer text-center",
                                                      day.isCurrentMonth && day.dayNumber === selectedDay
                                                          ? "bg-gray-400"
                                                          : day.isCurrentMonth
                                                            ? "hover:bg-gray-100"
                                                            : "bg-gray-100 text-gray-400",
                                                  )}
                                              >
                                                  {day.isCurrentMonth ? (
                                                      <DefaultDay
                                                          loading={loading}
                                                          day={day.dayNumber.toString()}
                                                          isToday={
                                                              day.dayNumber === realToday.day &&
                                                              day.fullPersianDate.month.index === realToday.month.index &&
                                                              day.fullPersianDate.year === realToday.year
                                                          }
                                                          onViewClick={() => handleSelectDate(day)}
                                                          holiday={isHoliday(day)}
                                                          todayReport={accountingItems?.today_report}
                                                          events={currentEvents(day.gregorianDate)}
                                                          goToDate={(d: any) => handleGoToDate(d, day)}
                                                      />
                                                  ) : (
                                                      ""
                                                  )}
                                              </td>
                                          ))}
                                      </tr>
                                  ))
                                : (() => {
                                      const firstDayIndex = getFirstDayIndex(currentDate);

                                      const currentWeekIndex = Math.floor((selectedDay - 1 + firstDayIndex) / 7);

                                      const week = daysMatrix[currentWeekIndex];

                                      if (!week) return null;

                                      return (
                                          <tr className="w-full grid grid-cols-7">
                                              {week.map((day, index) => (
                                                  <td
                                                      key={index}
                                                      onClick={() => handleDayClick(day)}
                                                      className={cn(
                                                          "p-1.5 border border-gray-300  cursor-pointer text-center",
                                                          day.isCurrentMonth && day.dayNumber === selectedDay
                                                              ? "bg-gray-400"
                                                              : day.isCurrentMonth
                                                                ? "hover:bg-gray-100"
                                                                : "bg-gray-100 text-gray-400",
                                                      )}
                                                  >
                                                      {day.isCurrentMonth ? (
                                                          <DefaultDay
                                                              loading={loading}
                                                              day={day.dayNumber.toString()}
                                                              isToday={
                                                                  day.dayNumber === realToday.day &&
                                                                  day.fullPersianDate.month.index === realToday.month.index &&
                                                                  day.fullPersianDate.year === realToday.year
                                                              }
                                                              onViewClick={() => handleSelectDate(day)}
                                                              holiday={isHoliday(day)}
                                                              todayReport={accountingItems?.today_report}
                                                              events={currentEvents(day.gregorianDate)}
                                                              goToDate={(d: any) => handleGoToDate(d, day)}
                                                          />
                                                      ) : (
                                                          ""
                                                      )}
                                                  </td>
                                              ))}
                                          </tr>
                                      );
                                  })()}
                        </tbody>
                    </table>
                )}

                {selectedTab === "day" && (
                    <SingleDayView
                        day={currentDate.day.toString()}
                        weekDay={getWeekDayName(currentDate)}
                        currentPersianDate={formatDateToFa(currentDate)}
                        currentDate={formatDateToEn(currentDate)}
                        isToday={currentDate.day === realToday.day && currentDate.month.index === realToday.month.index && currentDate.year === realToday.year}
                        onViewClick={() =>
                            handleSelectDate({
                                persianDate: formatDateToFa(currentDate),
                                gregorianDate: formatDateToEn(currentDate),
                                weekDayName: getWeekDayName(currentDate),
                            })
                        }
                        events={currentEvents(formatDateToEn(currentDate))}
                        todayReport={accountingItems?.today_report}
                    />
                )}
            </div>

            <EventDayModal
                open={showModal}
                setOpen={setShowModal}
                fullDate={selectedDate}
                events={currentEvents(selectedDate?.gregorianDate)}
                isToday={
                    (selectedTab === "day" &&
                        currentDate.day === realToday.day &&
                        currentDate.month.index === realToday.month.index &&
                        currentDate.year === realToday.year) ||
                    (selectedDate.dayNumber === realToday.day &&
                        selectedDate.fullPersianDate.month.index === realToday.month.index &&
                        selectedDate.fullPersianDate.year === realToday.year)
                }
                todayReport={accountingItems?.today_report}
                goToDate={(d: any) => handleGoToDate(d, currentDate.day)}
            />
        </>
    );
}
