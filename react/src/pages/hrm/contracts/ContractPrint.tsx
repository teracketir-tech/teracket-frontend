// src/pages/hrm/contracts/ContractPrint.jsx

import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Printer, ArrowLeft, Download } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import Button from '@/components/shared/Button';
import Loading from '@/components/shared/Loading';
import { formatDateToFa } from '@/lib/utils';
import { useReactToPrint } from 'react-to-print';

// ============== وضعیت‌های قرارداد ==============
const CONTRACT_TYPES = {
    1: 'موقت',
    2: 'ساعتی',
    3: 'پیمانکاری',
};

export default function ContractPrint() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const printRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [contract, setContract] = useState(null);
    const [error, setError] = useState(null);

    const shouldDownloadPdf = searchParams.get('spdf') === 'true';

    // دریافت اطلاعات قرارداد
    useEffect(() => {
        const fetchContract = async () => {
            try {
                setLoading(true);
                const res = await api(`hrm-contract/${id}`, 'GET');
                if (res?.success && res?.data) {
                    setContract(res.data);
                } else {
                    setError('قرارداد یافت نشد');
                    toast.error('خطا در دریافت اطلاعات قرارداد');
                }
            } catch (error) {
                console.error('Error fetching contract:', error);
                setError('خطا در دریافت اطلاعات');
                toast.error('خطا در دریافت اطلاعات قرارداد');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchContract();
        }
    }, [id]);

    // ===== تابع چاپ با react-to-print =====
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `قرارداد_${contract?.id || 'unknown'}`,
        onAfterPrint: () => {
            toast.success('چاپ با موفقیت انجام شد');
        },
        onPrintError: (error) => {
            console.error('Print error:', error);
            toast.error('خطا در چاپ');
        }
    });

    // ===== تابع دانلود PDF با react-to-print =====
    const handleDownloadPDF = useReactToPrint({
        contentRef: printRef,
        documentTitle: `قرارداد_${contract?.id || 'unknown'}`,
        onAfterPrint: () => {
            toast.success('PDF با موفقیت دانلود شد');
            if (shouldDownloadPdf) {
                navigate('/hrm/contract/create');
            }
        },
        onPrintError: (error) => {
            console.error('PDF error:', error);
            toast.error('خطا در تولید PDF');
        }
    });

    // ===== دانلود خودکار PDF =====
    useEffect(() => {
        if (shouldDownloadPdf && contract && !loading) {
            setTimeout(() => {
                handleDownloadPDF();
            }, 1000);
        }
    }, [shouldDownloadPdf, contract, loading]);

    const handleBack = () => {
        navigate('/hrm/contract/create');
    };

    const formatNumber = (num) => {
        if (!num) return '۰';
        return new Intl.NumberFormat('fa-IR').format(num);
    };

    const formatDate = (date) => {
        if (!date) return '---';
        return formatDateToFa(date);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loading size="large" />
            </div>
        );
    }

    if (error || !contract) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p className="text-red-500 text-lg">{error || 'قرارداد یافت نشد'}</p>
                <Button onClick={handleBack} className="mt-4">
                    بازگشت
                </Button>
            </div>
        );
    }

    const fullName = `${contract.first_name || ''} ${contract.last_name || ''}`.trim() || '---';

    // ============== رندر محتوای قرارداد ==============
    const ContractContent = React.forwardRef((props, ref) => (
        <div 
            ref={ref} 
            dir="rtl" 
            style={{ 
                backgroundColor: '#ffffff', 
                color: '#000000', 
                padding: '40px', 
                fontFamily: 'inherit',
                maxWidth: '100%'
            }}
        >
            {/* سربرگ */}
            <div style={{ textAlign: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                    <span>کد: P-047-F-O-C-1</span>
                    <span>شماره بازنگری: 01</span>
                    <span>تاریخ بازنگری: 1396/04/25</span>
                    <span>سطح سازمانی: 1</span>
                </div>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000' }}>قرارداد کار</h1>
                <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}>شماره قرارداد: {contract.id || '---'}</p>
            </div>

            {/* مقدمه */}
            <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginBottom: '16px', color: '#000000' }}>
                این قرارداد به موجب مواد ۱۰، ۳۹ قانون کار جمهوری اسلامی ایران، بین کارفرما و همکار (کارمند-کارگر) منعقد می شود.
            </p>

            {/* ماده ۱ */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>۱)</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>طرفین قرارداد:</span>
                </div>
                <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginTop: '4px', paddingRight: '24px', color: '#000000' }}>
                    این قرارداد فی مابین انتشارات پایگان به کارفرمائی آقای علی ابراهیم زاده به نشانی تهران - طالقانی غربی بعد از میدان فلسطین خیابان فریمان کوچه ملک پالک ۱۶ و تلفن تماس ۶۶۴۶۵۱۲۲-۰۲۱ نامیده می‌شود از یک طرف و آقای/خانم {fullName} فرزند {contract.father_name || '---'} متولد {formatDate(contract.birth_date)} به شماره شناسنامه {contract.shenasname_number || '---'} صادره از {contract.shenasname_city || '---'} کد ملی {contract.national_code || '---'} - وضعیت تاهل {contract.marital_status_label || '---'} تلفن ثابت {contract.phone || '---'} - تلفن همراه {contract.mobile || '---'} به نشانی {contract.address || '---'} و کدپستی که از این پس همکار نامیده می‌شود، از طرف دیگر منعقد می‌گردد.
                </p>
            </div>

            {/* ماده ۲ */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>۲)</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>موضوع قرارداد عبارتست از:</span>
                </div>
                <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginTop: '4px', paddingRight: '24px', color: '#000000' }}>
                    انجام کلیه وظایف محوله / ارائه خدمات در حوزه {contract.job_title || '....................'}
                </p>
            </div>

            {/* ماده ۳ */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>۳)</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>محل انجام کار:</span>
                </div>
                <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginTop: '4px', paddingRight: '24px', color: '#000000' }}>
                    کلیه دفاتر انتشارات پایگان در سطح شهر تهران با صلاحدید کارفرما.
                </p>
                <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginTop: '4px', paddingRight: '24px', color: '#333333' }}>
                    تبصره ۱: در صورت نیاز به انجام ماموریت داخل و برون شهری (حداقل فاصله ۵۰ کیلومتری) همکار متعهد می‌گردد وظایف محوله را به نحو احسن انجام داده و کارفرما نیز متعهد می‌گردد حق ماموریت همکار را طبق مقررات قانون کار به ایشان پرداخت نماید.
                </p>
            </div>

            {/* ماده ۴ */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>۴)</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>نوع و مدت قرارداد:</span>
                </div>
                <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginTop: '4px', paddingRight: '24px', color: '#000000' }}>
                    نوع قرارداد {CONTRACT_TYPES[contract.contract_type] || '---'} و مدت آن {contract.contract_duration_months || 0} ماه از تاریخ {formatDate(contract.contract_from_date)} لغایت {formatDate(contract.contract_to_date)} می‌باشد.
                </p>
            </div>

            {/* ماده ۵ */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>۵)</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>ساعت کار:</span>
                </div>
                <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginTop: '4px', paddingRight: '24px', color: '#000000' }}>
                    همکار متعهد است جهت ارائه خدمات مشروحه ماده ۲، حداقل {contract.minimum_hours || '......'} ساعت در ماه در محل فعالیت کارفرما حضور و امور مربوطه را نظارت و انجام دهد و در صورت نیاز به حضور بیشتر هماهنگی لازم معمول خواهد گردید.
                </p>
            </div>

            {/* ماده ۶ */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>۶)</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>حق‌السعی و مزایای ضمن و پایان کار:</span>
                </div>
                <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginTop: '4px', paddingRight: '24px', color: '#000000', whiteSpace: 'pre-wrap' }}>
                    مبلغی که بابت موضوع قرارداد به همکار به صورت ماهانه پرداخت خواهد شد، به شرح ذیل می‌باشد:
                    
{contract.contract_type == 2 ? `* مزد ساعتی با احتساب تعطیلات هفتگی ${formatNumber(contract.hourly_salary || 0)} ریال` : `* مزد ماهانه ${formatNumber(contract.base_salary || 0)} ریال`}
{contract.contract_type == 1 ? `* حق اولاد ${formatNumber(contract.child_allowance || 0)} ریال` : ''}
{contract.contract_type == 1 ? `* کمک هزینه مسکن ${formatNumber(contract.housing_allowance || 0)} ریال` : ''}
{contract.contract_type == 1 ? `* حق سنوات ${formatNumber(contract.seniority_allowance || 0)} ریال` : ''}
{contract.contract_type == 2 ? `* کمک هزینه مسکن ساعتی ${formatNumber(contract.hourly_housing_allowance || 0)} ریال` : ''}
{contract.contract_type == 2 ? `* حق اولاد ساعتی ${formatNumber(contract.hourly_child_allowance || 0)} ریال` : ''}
{contract.contract_type == 2 ? `* حق سنوات ساعتی ${formatNumber(contract.hourly_seniority_allowance || 0)} ریال` : ''}
* جمع {formatNumber(contract.total_salary || 0)} ریال
                </p>
                <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginTop: '4px', paddingRight: '24px', color: '#333333' }}>
                    تبصره ۲: حق‌السعی ماهانه توسط کارفرما و پس از کسر کسورات قانونی نظیر بیمه و مالیات پرداخت خواهد شد.
                </p>
            </div>

            {/* ماده ۷ */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>۷)</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>بیمه:</span>
                </div>
                <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginTop: '4px', paddingRight: '24px', color: '#000000' }}>
                    همکار در مدت اشتغال، نزد سازمان تامین اجتماعی بیمه خواهد شد و از این بابت حق بیمه به صورت ماهیانه از حقوق همکار کسر خواهد گردید.
                </p>
            </div>

            {/* ===== فقط در چاپ نمایش داده میشه ===== */}
             <div>

                 <div className="just-print" style={{display: 'none' }}>
                      <br/>
                <br/>
                  <br/>
                </div>
                 <div className="just-print" style={{ textAlign: 'center' ,marginTop: '15px',height: '64px', paddingTop: '10px', borderTop: '1px solid #e5e7eb', display: 'none' }}>
                
                 <div>
                    <div style={{ textAlign: 'center' ,width:'50%' ,display:'inline-flex' ,height: '64px',}}>
                    <div style={{ height: '64px', borderBottom: '2px dashed #d1d5db', marginBottom: '8px' }}></div>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>امضاء و اثر انگشت همکار</p>
                </div>
                <div style={{ textAlign: 'center',width:'50%',display:'inline-flex',height: '64px', }}>
                    <div style={{ height: '64px', borderBottom: '2px dashed #d1d5db', marginBottom: '8px' }}></div>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>امضاء و مهر کارفرما</p>
                </div>
                 </div>
              
            </div>
             <div className="just-print" style={{display: 'none' }}>
                  <br/>
                <br/> <br/>
                 
                </div>
                </div>
            {/* ماده ۸ */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>۸)</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>مرخصی و تعطیلات رسمی:</span>
                </div>
                <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginTop: '4px', paddingRight: '24px', color: '#000000' }}>
                    همکار با توجه به مدت کارکرد حق استفاده از مرخصی استحقاقی، تعطیلات رسمی و سایر انواع مرخصی را طبق مقررات قانون کار دارا خواهد بود، براساس ماده ۴ قانون کار میزان مرخصی استحقاقی همکار در سال با احتساب ۶۴ جمعه، جمعاً یکماه بوده و چگونگی تقسیم آن در طی سال با صلاحدید کارفرما می‌باشد.
                </p>
            </div>

            {/* ماده ۹ */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>۹)</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>جبران خسارت:</span>
                </div>
                <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginTop: '4px', paddingRight: '24px', color: '#000000', whiteSpace: 'pre-wrap' }}>
                    ۹-۱- طبق قانون مسئولیت مدنی هیچ کس حق ندارد که به دیگری خسارت و زیان وارد نماید و در صورت ورود زیان چه در اثر فعل و چه ترک فعل، ضامن خواهد بود.

                    ۹-۲- همکار، ملزم به اجرای صحیح مقررات داخلی شرکت می‌باشد و بایستی امور مربوط به شغل خود را زیر نظر کارفرما یا نماینده او یا سرپرست مستقیم واحد انجام دهد، هرگونه سهل‌انگاری یا بی‌احتیاطی که موجب ضرر و زیان و یا آسیب به وسایل اداری، سیستم‌ها، تجهیزات و ... گردد به عهده همکار بوده و مسئول جبران آن (به میزانی که کارفرما تعیین می‌کند) خواهد بود، لذا همکار ملزم به حضور در محل فعالیت کارفرما و اعلام خسارت وارده و پذیرش میزان بدهی جهت جبران خسارت می‌باشد، درصورت عدم حضور و اعلام خسارت یا عدم پذیرش جبران خسارت، کارفرما جهت جبران خسارت خود از طریق طرح دعوا در مراجع قضائی ذیصلاح اقدام خواهد نمود.

                    ۹-۳- همکار متعهد می‌شود، کلیه اطلاعات مربوط به عملیات کارفرما در همه زمینه‌ها را که حین خدمت کسب و یا به آن دسترسی پیدا می‌کند را محرمانه تلقی کرده و در حین خدمت و پس از آن به اشخاص غیرمجاز تحویل و یا افشاء ننماید و درصورتی که در نتیجه اعمال فوق، زیان و یا خسارتی به شرکت وارد شود همکار قانوناً ملزم و متعهد به جبران زیان و خسارت وارده به شرکت خواهد بود.

                    ۹-۴- همکار مکلف است پیش از تسویه حساب نسبت به انتقال دانش فنی و اطلاعات مرتبط با حوزه کاری به کارفرما و یا هر فرد حقیقی و حقوقی که کارفرما معرفی نموده، اقدام و در غیر این صورت کارفرما می‌تواند نسبت به تحصیل حقوق خود از راه‌های قانونی پیگیری نماید.
                </p>
            </div>

            {/* ماده ۱۰ */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>۱۰)</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>حل اختلاف:</span>
                </div>
                <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginTop: '4px', paddingRight: '24px', color: '#000000' }}>
                    حل هرگونه اختلاف بین طرفین بدواً از طریق سازش بین طرفین حل و فصل، و در صورت عدم سازش در مراجع حل اختلاف مطابق مقررات قانون کار حل و فصل خواهند گردید.
                </p>
            </div>

            {/* ماده ۱۱ */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>۱۱)</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>نشانی و آدرس اقامتگاه قانونی طرفین قرارداد:</span>
                </div>
                <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginTop: '4px', paddingRight: '24px', color: '#000000' }}>
                    همان نشانی اعلام شده در ماده ۱ قرارداد می‌باشد و درصورت نقل مکان هریک از طرفین یا اشتباه اعلام نمودن نشانی، مکلفند نشانی جدید و صحیح خود را به طرف مقابل اعلام نمایند، در غیر این صورت تمامی مکاتبات و ابلاغیه‌ها به نشانی مندرج در این قرارداد ارسال و به منزله ابلاغ قانونی می‌باشد.
                </p>
            </div>

            {/* ماده ۱۲ */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>۱۲)</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>سایر موارد:</span>
                </div>
                <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginTop: '4px', paddingRight: '24px', color: '#000000' }}>
                    سایر مواردی که در این قرارداد پیش‌بینی نگردیده، تابع مقررات قانون کار خواهد بود.
                </p>
            </div>

            {/* ماده ۱۳ */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>۱۳)</span>
                </div>
                <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginTop: '4px', paddingRight: '24px', color: '#000000' }}>
                    همکار با آگاهی کامل از مفاد این قرارداد تأیید می‌نماید که توانایی انجام آن را براساس شرح وظایف تعیین شده دارد و با امضاء قرارداد آمادگی خود را برای همکاری اعلام می‌نماید.
                </p>
            </div>

            {/* ماده ۱۴ */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>۱۴)</span>
                </div>
                <p style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.8', marginTop: '4px', paddingRight: '24px', color: '#000000' }}>
                    این قرارداد شامل دو تبصره و پیوست شرح وظایف و تعهدنامه حفاظت از اعطالت می‌باشد.
                </p>
            </div>

            {/* امضاء در صفحه نمایش */}
            <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ height: '64px', borderBottom: '2px dashed #d1d5db', marginBottom: '8px' }}></div>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>امضاء و اثر انگشت همکار</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ height: '64px', borderBottom: '2px dashed #d1d5db', marginBottom: '8px' }}></div>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>امضاء و مهر کارفرما</p>
                </div>
            </div>

            {/* تاریخ */}
            <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
                <p>تاریخ چاپ: {new Date().toLocaleDateString('fa-IR')}</p>
            </div>
        </div>
    ));

    return (
        <div className="w-full space-y-4">
            {/* هدر */}
            <div className="no-print flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={handleBack} className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        بازگشت
                    </Button>
                    <span className="text-sm text-gray-500">|</span>
                    <span className="text-sm font-medium text-gray-700">
                        شماره قرارداد: {contract.id || '---'}
                    </span>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => handlePrint()} className="flex items-center gap-2">
                        <Printer className="w-4 h-4" />
                        چاپ
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => handleDownloadPDF()}
                        className="flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        دانلود PDF
                    </Button>
                </div>
            </div>

            {/* محتوای قرارداد */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden" id="contract-print-content">
                <ContractContent ref={printRef} />
            </div>

            {/* ===== استایل‌های چاپ ===== */}
            <style>{`
                /* مخفی کردن هدر و دکمه‌ها در چاپ */
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    
                    /* نمایش just-print در چاپ */
                    .just-print {
                        display: block !important;
                    }
                    
                    /* حذف سایه و border در چاپ */
                    #contract-print-content {
                        box-shadow: none !important;
                        border-radius: 0 !important;
                    }
                    
                    /* تنظیم حاشیه صفحه */
                    @page {
                         
                    }
                    
                    /* تنظیمات کلی چاپ */
                    body {
                        background-color: #ffffff !important;
                    }
                }
            `}</style>
        </div>
    );
}