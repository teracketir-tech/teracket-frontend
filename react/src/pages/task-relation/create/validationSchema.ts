import * as yup from "yup";

/**
 * Feedback 4: every Lead/Lag wording is Persian — «پیش افتادگی» for a
 * negative (lead) value, «تاخیر» for a positive (lag) one.
 */
const commonFields = {
    project_id: yup.string().required("لطفا پروژه را انتخاب کنید"),
    predecessor_task_id: yup.string().required("لطفا تسک مقدم را انتخاب کنید"),
    relation_type: yup.string().required("لطفا نوع رابطه را انتخاب کنید"),
    lag: yup.number().typeError("لطفا مقدار پیش افتادگی - تاخیر را وارد کنید (می‌تواند منفی باشد)"),
    lag_unit: yup.string().required("لطفا واحد پیش افتادگی - تاخیر را انتخاب کنید"),
};

/**
 * One predecessor may carry one or many successors, and none of them may be
 * the predecessor itself. Create AND edit share this schema: the edit page is
 * multi-successor too (feedback 3), it just starts from the one stored row.
 */
const relationSchema = yup.object().shape({
    ...commonFields,
    successor_task_ids: yup
        .array()
        .of(yup.string().nullable())
        .min(1, "لطفا حداقل یک تسک وابسته را انتخاب کنید")
        .required("لطفا تسک وابسته را انتخاب کنید")
        .test("not-same", "تسک مقدم و وابسته نمی‌توانند یکی باشند", function (value) {
            const predecessor = this.parent.predecessor_task_id;

            if (!value || !predecessor) return true;

            return !value.some((id) => String(id) === String(predecessor));
        }),
});

export default relationSchema;
