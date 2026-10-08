import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import Select from "./inputs/Select";

export default function StateSelect({
    formik,
    required,
    name = "state_id",
    cityName = "city_id",
}: {
    name?: string;
    cityName?: string;
    formik: any;
    required?: boolean;
}) {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStates = async () => {
        setLoading(true);

        const res = await api("state", "GET");

        if (res?.data) setStates(res.data.map((d: any) => ({ label: d.name, value: d.id.toString() })));

        setLoading(false);
    };

    const fetchCities = async (stateId: any) => {
        setLoading(true);

        const res = await api(`state/${stateId}/cities`, "GET");

        if (res?.data) setCities(res.data.map((d: any) => ({ label: d.name, value: d.id.toString() })));

        setLoading(false);
    };

    useEffect(() => {
        fetchStates();
    }, []);

    useEffect(() => {
        if (formik?.values?.[name]) fetchCities(formik?.values?.[name]);
    }, [formik?.values?.[name]]);

    return (
        <>
            <Select
                title="استان"
                name={name}
                required={required}
                formik={formik}
                options={states}
                setValue={(e) => {
                    if (e) fetchCities(e);
                    else setCities([]);
                }}
            />
            <Select title="شهر" name={cityName} required={required} formik={formik} options={cities} isLoading={loading} />
        </>
    );
}
