import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ResourceHeader from "../components/organisms/ResourceHeader";
import ResourceFilters from "../components/organisms/ResourceFilters";
import Pagination from "../components/molecules/Pagination";
import Modal from "../components/organisms/Modal";
import { Input, Select } from "../components/atoms/FormElements";
import Button from "../components/atoms/Button";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    useGetTrainingProgramsQuery,
    useCreateTrainingProgramMutation,
    useUpdateTrainingProgramMutation,
    useDeleteTrainingProgramMutation,
} from "../features/api/apiSlice";

const TECH_OPTIONS = [
    "UI/UX",
    "QA",
    "DevOps",
    "AI",
    "Frontend",
    "Backend",
    "Cloud",
];
const PROGRAM_TYPES = [
    "Bootcamp",
    "Workshop",
    "Mentorship",
    "Certification",
    "Short Course",
];
const METHODOLOGIES = ["Agile Scrum", "Kanban", "Waterfall", "Hybrid"];
const TRAINING_MODES = ["Live", "Recorded", "Hybrid"];
const WORK_SIMULATION = [
    "Demo Project",
    "Real Production Project",
    "Open Source Project",
];
const SKILL_OPTIONS = ["HTML", "CSS", "JavaScript", "PHP Basics", "Git Basics"];
const PROJECT_OPTIONS = [
    "Inventory System",
    "POS System",
    "Dental Clinic System",
    "Custom Product",
];
const CERTIFICATE_OPTIONS = [
    "Certificate of Completion",
    "Certificate of Excellence",
    "Participation Certificate",
];
const EXPERIENCE_LEVELS = ["Beginner", "Junior", "Intermediate"];
const TEAM_SIZES = [
    { value: 3, label: "3 Developers" },
    { value: 5, label: "5 Developers" },
    { value: 8, label: "8 Developers" },
];

const TrainingPrograms = () => {
    const { t, i18n } = useTranslation();
    const [query, setQuery] = useState("");
    const [viewMode, setViewMode] = useState("list");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editProgram, setEditProgram] = useState(null);
    const isEditing = Boolean(editProgram);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const [form, setForm] = useState({
        title: "",
        code: "",
        slug: "",
        short_description: "",
        description: "",
        cover_image: null,
        intro_video: null,
        status: "draft",
        program_type: "",
        product_target: "",
        tech_stack: [],
        methodology: "",
        training_mode: "",
        start_date: "",
        end_date: "",
        duration_weeks: "",
        weekly_hours: "",
        days_of_week: [],
        min_capacity: "",
        max_capacity: "",
        enrolled: 0,
        required_skills: [],
        experience_level: "Beginner",
        admission_test: "No",
        interview: "No",
        outcomes: "",
        projects: [],
        certificates: [],
        portfolio: false,
        recommendation: false,
        training_team: [],
        price: "",
        discount: "",
        installment_available: false,
        installments_count: 0,
        work_simulation: "",
        team_size: "",
        git_repo_access: false,
        code_review: false,
        sprint_planning: false,
        daily_standup: false,
        final_deployment: false,
    });
    const {
        data: programsData,
        isLoading,
        refetch,
    } = useGetTrainingProgramsQuery({ search: query });
    const [createProgram] = useCreateTrainingProgramMutation();
    const [updateProgram] = useUpdateTrainingProgramMutation();
    const [deleteProgram] = useDeleteTrainingProgramMutation();

    const programs =
        programsData?.data?.data || programsData?.data || programsData || [];

    const totalItems = programs.length;
    const displayCount =
        totalItems === 0 ? 0 : Math.min(itemsPerPage, totalItems);
    const visiblePrograms = programs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const openCreate = () => {
        setEditProgram(null);
        setForm((f) => ({
            ...f,
            title: "",
            code: "",
            slug: "",
            short_description: "",
            description: "",
            cover_image: null,
            intro_video: null,
            status: "draft",
            program_type: "",
            product_target: "",
            tech_stack: [],
            methodology: "",
            training_mode: "",
            start_date: "",
            end_date: "",
            duration_weeks: "",
            weekly_hours: "",
            days_of_week: [],
            min_capacity: "",
            max_capacity: "",
            enrolled: 0,
            required_skills: [],
            experience_level: "Beginner",
            admission_test: "No",
            interview: "No",
            outcomes: "",
            projects: [],
            certificates: [],
            portfolio: false,
            recommendation: false,
            training_team: [],
            price: "",
            discount: "",
            installment_available: false,
            installments_count: 0,
            work_simulation: "",
            team_size: "",
            git_repo_access: false,
            code_review: false,
            sprint_planning: false,
            daily_standup: false,
            final_deployment: false,
        }));
        setIsModalOpen(true);
    };
    const buildProgramPayload = (values) => {
        const payload = {};

        const setIfPresent = (key, value) => {
            if (value !== undefined && value !== null && value !== "") {
                payload[key] = value;
            }
        };

        setIfPresent("title", values.title);
        setIfPresent("description", values.description);
        setIfPresent("short_description", values.short_description);
        setIfPresent("slug", values.slug);
        setIfPresent(
            "training_type",
            values.training_type || values.program_type,
        );
        setIfPresent("project_type", values.project_type);
        setIfPresent("methodology", values.methodology);
        setIfPresent("level", values.level || values.experience_level);
        setIfPresent("duration_weeks", values.duration_weeks);
        setIfPresent("weekly_hours", values.weekly_hours);
        setIfPresent("start_date", values.start_date);
        setIfPresent("end_date", values.end_date);
        setIfPresent(
            "price",
            values.price !== "" ? Number(values.price) : undefined,
        );
        setIfPresent(
            "discount_price",
            values.discount_price !== undefined
                ? values.discount_price
                : values.discount !== ""
                  ? Number(values.discount)
                  : undefined,
        );
        const capacityValue = values.max_capacity || values.capacity;
        if (capacityValue !== undefined && capacityValue !== "") {
            payload.capacity = Number(capacityValue);
        }
        if (values.certificates?.length > 0) {
            payload.certificate_available = true;
        }
        if (values.portfolio !== undefined) {
            payload.portfolio_available = values.portfolio;
        }
        if (values.admission_test !== undefined) {
            payload.admission_test_required = values.admission_test === "Yes";
        }
        if (values.interview !== undefined) {
            payload.interview_required = values.interview === "Yes";
        }
        setIfPresent("status", values.status);
        return payload;
    };

    const openEdit = (p) => {
        setEditProgram(p);
        setForm({
            ...p,
            title: p.title || p.name || "",
            code: p.code || "",
            slug: p.slug || "",
            short_description: p.short_description || "",
            description: p.description || "",
            cover_image: p.cover_image || null,
            intro_video: p.intro_video || null,
            training_type: p.training_type || p.program_type || "",
            project_type: p.project_type || "",
            methodology: p.methodology || "",
            level: p.level || p.experience_level || "",
            duration_weeks: p.duration_weeks || "",
            weekly_hours: p.weekly_hours || "",
            start_date: p.start_date || "",
            end_date: p.end_date || "",
            min_capacity: p.min_capacity || "",
            max_capacity: p.capacity ?? p.max_capacity ?? "",
            enrolled: p.enrolled || 0,
            required_skills: p.required_skills || [],
            experience_level: p.experience_level || p.level || "Beginner",
            admission_test: p.admission_test_required ? "Yes" : "No",
            interview: p.interview_required ? "Yes" : "No",
            outcomes: p.outcomes || "",
            projects: p.projects || [],
            certificates: p.certificates || [],
            portfolio: p.portfolio_available ?? p.portfolio ?? false,
            recommendation: p.recommendation || false,
            training_team: p.training_team || [],
            price: p.price ?? "",
            discount: p.discount_price ?? p.discount ?? "",
            installment_available: p.installment_available || false,
            installments_count: p.installments_count || 0,
            work_simulation: p.work_simulation || "",
            team_size: p.team_size || "",
            git_repo_access: p.git_repo_access || false,
            code_review: p.code_review || false,
            sprint_planning: p.sprint_planning || false,
            daily_standup: p.daily_standup || false,
            final_deployment: p.final_deployment || false,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = buildProgramPayload(form);
            if (editProgram) {
                await updateProgram({
                    id: editProgram.id,
                    ...payload,
                }).unwrap();
                toast.success("Updated");
            } else {
                await createProgram(payload).unwrap();
                toast.success("Created");
            }
            setIsModalOpen(false);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete?")) return;
        try {
            await deleteProgram(id).unwrap();
            toast.success("Deleted");
            refetch();
        } catch (err) {
            toast.error("Error");
        }
    };

    const toggleTech = (tech) => {
        setForm((prev) => ({
            ...prev,
            tech_stack: prev.tech_stack.includes(tech)
                ? prev.tech_stack.filter((t) => t !== tech)
                : [...prev.tech_stack, tech],
        }));
    };

    const toggleSkill = (skill) => {
        setForm((prev) => ({
            ...prev,
            required_skills: prev.required_skills.includes(skill)
                ? prev.required_skills.filter((s) => s !== skill)
                : [...prev.required_skills, skill],
        }));
    };

    const toggleProject = (proj) => {
        setForm((prev) => ({
            ...prev,
            projects: prev.projects.includes(proj)
                ? prev.projects.filter((p) => p !== proj)
                : [...prev.projects, proj],
        }));
    };

    const addTeamMember = () => {
        setForm((prev) => ({
            ...prev,
            training_team: [...prev.training_team, { role: "", name: "" }],
        }));
    };

    const updateTeamMember = (index, key, value) => {
        setForm((prev) => ({
            ...prev,
            training_team: prev.training_team.map((m, i) =>
                i === index ? { ...m, [key]: value } : m,
            ),
        }));
    };

    const removeTeamMember = (index) => {
        setForm((prev) => ({
            ...prev,
            training_team: prev.training_team.filter((_, i) => i !== index),
        }));
    };

    const availableSeats = useMemo(() => {
        const max = Number(form.max_capacity) || 0;
        const enrolled = Number(form.enrolled) || 0;
        return Math.max(0, max - enrolled);
    }, [form.max_capacity, form.enrolled]);

    const finalPrice = useMemo(() => {
        const p = Number(form.price) || 0;
        const d = Number(form.discount) || 0;
        return Math.max(0, p - d);
    }, [form.price, form.discount]);

    return (
        <div
            className="space-y-6 pb-10"
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
            <ResourceHeader
                title={t("auto.training_programs")}
                description={
                    totalItems === 0
                        ? "No programs loaded yet"
                        : `${displayCount} programs loaded`
                }
                onRefresh={refetch}
                onAdd={openCreate}
            />

            <ResourceFilters
                onSearch={(val) => setQuery(val)}
                onViewChange={setViewMode}
                currentView={viewMode}
            />

            {isLoading ? (
                <div className="flex justify-center p-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-theme-primary"></div>
                </div>
            ) : (
                <div>
                    {viewMode === "list" ? (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-start">
                                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                                        <tr>
                                            <th className="px-3 py-2 text-start">
                                                Program
                                            </th>
                                            <th className="px-3 py-2">Type</th>
                                            <th className="px-3 py-2">Dates</th>
                                            <th className="px-3 py-2">Seats</th>
                                            <th className="px-3 py-2">Price</th>
                                            <th className="px-3 py-2">Flags</th>
                                            <th className="px-3 py-2">
                                                Status
                                            </th>
                                            <th className="px-3 py-2">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {visiblePrograms.map((p) => (
                                            <tr
                                                key={p.id}
                                                className="hover:bg-slate-50 smooth-transition"
                                            >
                                                <td className="px-3 py-2">
                                                    <div className="font-bold text-sm">
                                                        {p.title || p.name}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400">
                                                        {p.short_description}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-sm text-slate-600">
                                                    {p.training_type ||
                                                        p.project_type ||
                                                        "General"}
                                                    <div className="text-[11px] text-slate-400 mt-1">
                                                        {p.methodology
                                                            ? `${p.methodology} • `
                                                            : ""}
                                                        {p.level ?? ""}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-sm text-slate-600">
                                                    {p.start_date || "-"}
                                                    <div className="text-[11px] text-slate-400 mt-1">
                                                        {p.end_date || "-"}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-sm">
                                                    {p.available_seats != null
                                                        ? `${p.available_seats} / ${p.capacity ?? "-"}`
                                                        : (p.capacity ?? "-")}
                                                </td>
                                                <td className="px-3 py-2 text-sm">
                                                    {p.price === 0
                                                        ? "Free"
                                                        : p.discount_price !=
                                                            null
                                                          ? `${p.discount_price} (discount)`
                                                          : p.price != null
                                                            ? p.price
                                                            : "-"}
                                                </td>
                                                <td className="px-3 py-2 text-sm">
                                                    <div className="flex flex-wrap gap-1 text-[11px] text-slate-500">
                                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5">
                                                            Cert:{" "}
                                                            {p.certificate_available
                                                                ? "Yes"
                                                                : "No"}
                                                        </span>
                                                        <span className="rounded-full bg-slate-100 px-2 py-0.5">
                                                            Portfolio:{" "}
                                                            {p.portfolio_available
                                                                ? "Yes"
                                                                : "No"}
                                                        </span>
                                                        <span className="rounded-full bg-slate-100 px-2 py-0.5">
                                                            Test:{" "}
                                                            {p.admission_test_required
                                                                ? "Yes"
                                                                : "No"}
                                                        </span>
                                                        <span className="rounded-full bg-slate-100 px-2 py-0.5">
                                                            Interview:{" "}
                                                            {p.interview_required
                                                                ? "Yes"
                                                                : "No"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-sm">
                                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                                                        {p.status || "draft"}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-sm">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            icon={faEdit}
                                                            onClick={() =>
                                                                openEdit(p)
                                                            }
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            icon={faTrash}
                                                            onClick={() =>
                                                                handleDelete(
                                                                    p.id,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {totalItems === 0 && (
                                    <div className="p-10 text-center text-slate-500">
                                        No programs found.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {visiblePrograms.map((p) => (
                                <div
                                    key={p.id}
                                    className="bg-white rounded-xl p-4 border border-slate-200"
                                >
                                    <div className="font-bold text-slate-800">
                                        {p.title || p.name}
                                    </div>
                                    <div className="text-[12px] text-slate-500 mt-1">
                                        {p.short_description ||
                                            p.description ||
                                            "No description available."}
                                    </div>
                                    <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-slate-500">
                                        <div>
                                            <span className="font-semibold text-slate-700">
                                                Type:
                                            </span>{" "}
                                            {p.training_type ||
                                                p.project_type ||
                                                "General"}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-700">
                                                Duration:
                                            </span>{" "}
                                            {p.duration_weeks
                                                ? `${p.duration_weeks} weeks`
                                                : "-"}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-700">
                                                Dates:
                                            </span>{" "}
                                            {p.start_date || "-"} →{" "}
                                            {p.end_date || "-"}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-700">
                                                Capacity:
                                            </span>{" "}
                                            {p.available_seats != null
                                                ? `${p.available_seats} / ${p.capacity ?? "-"}`
                                                : (p.capacity ?? "-")}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-700">
                                                Price:
                                            </span>{" "}
                                            {p.price === 0
                                                ? "Free"
                                                : p.discount_price != null
                                                  ? `${p.discount_price} (discount)`
                                                  : (p.price ?? "-")}
                                        </div>
                                    </div>
                                    <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-slate-500">
                                        <div>
                                            <span className="font-semibold text-slate-700">
                                                Certificate:
                                            </span>{" "}
                                            {p.certificate_available
                                                ? "Yes"
                                                : "No"}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-700">
                                                Portfolio:
                                            </span>{" "}
                                            {p.portfolio_available
                                                ? "Yes"
                                                : "No"}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-700">
                                                Test:
                                            </span>{" "}
                                            {p.admission_test_required
                                                ? "Yes"
                                                : "No"}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-700">
                                                Interview:
                                            </span>{" "}
                                            {p.interview_required
                                                ? "Yes"
                                                : "No"}
                                        </div>
                                    </div>
                                    <div className="mt-3 text-sm text-slate-700">
                                        <span className="font-semibold">
                                            Status:
                                        </span>{" "}
                                        {p.status || "draft"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div>
                <Pagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={(p) => setCurrentPage(p)}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editProgram ? "Edit Program" : "Create Program"}
                size="lg"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setIsModalOpen(false)}
                            type="button"
                            className="px-5 py-2.5 rounded-md"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={handleSubmit}
                            className="px-5 py-2.5 rounded-md min-w-[140px] bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {editProgram ? "Save Program" : "Create Program"}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isEditing ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Input
                                    label="Program Title"
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            title: e.target.value,
                                        })
                                    }
                                />
                                <Select
                                    label="Status"
                                    value={form.status}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            status: e.target.value,
                                        })
                                    }
                                    options={[
                                        { value: "draft", label: "Draft" },
                                        {
                                            value: "published",
                                            label: "Published",
                                        },
                                        {
                                            value: "registration_open",
                                            label: "Registration Open",
                                        },
                                        {
                                            value: "registration_closed",
                                            label: "Registration Closed",
                                        },
                                        { value: "running", label: "Running" },
                                        {
                                            value: "completed",
                                            label: "Completed",
                                        },
                                        {
                                            value: "cancelled",
                                            label: "Cancelled",
                                        },
                                    ]}
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        Short Description
                                    </label>
                                    <textarea
                                        className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700"
                                        rows={3}
                                        value={form.short_description}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                short_description:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        Product Target
                                    </label>
                                    <Input
                                        label="Product Target"
                                        value={form.product_target}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                product_target: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Tech Stack
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {TECH_OPTIONS.map((tch) => (
                                        <button
                                            type="button"
                                            key={tch}
                                            onClick={() => toggleTech(tch)}
                                            className={`px-3 py-1 rounded-md border ${form.tech_stack.includes(tch) ? "bg-blue-600 text-white" : "bg-white text-slate-600"}`}
                                        >
                                            {tch}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <Select
                                    label="Program Type"
                                    value={form.program_type}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            program_type: e.target.value,
                                        })
                                    }
                                    options={PROGRAM_TYPES.map((p) => ({
                                        value: p,
                                        label: p,
                                    }))}
                                />
                                <Select
                                    label="Methodology"
                                    value={form.methodology}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            methodology: e.target.value,
                                        })
                                    }
                                    options={METHODOLOGIES.map((p) => ({
                                        value: p,
                                        label: p,
                                    }))}
                                />
                                <Select
                                    label="Training Mode"
                                    value={form.training_mode}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            training_mode: e.target.value,
                                        })
                                    }
                                    options={TRAINING_MODES.map((p) => ({
                                        value: p,
                                        label: p,
                                    }))}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <Input
                                    label="Start Date"
                                    type="date"
                                    value={form.start_date}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            start_date: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    label="End Date"
                                    type="date"
                                    value={form.end_date}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            end_date: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    label="Duration (weeks)"
                                    type="number"
                                    value={form.duration_weeks}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            duration_weeks: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Input
                                        label="Weekly Hours"
                                        type="number"
                                        value={form.weekly_hours}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                weekly_hours: e.target.value,
                                            })
                                        }
                                    />
                                    <Input
                                        label="Min Capacity"
                                        type="number"
                                        value={form.min_capacity}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                min_capacity: e.target.value,
                                            })
                                        }
                                    />
                                    <Input
                                        label="Capacity"
                                        type="number"
                                        value={form.max_capacity}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                max_capacity: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Schedule Days
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday",
                                        ].map((day) => (
                                            <label
                                                key={day}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={form.days_of_week.includes(
                                                        day,
                                                    )}
                                                    onChange={() =>
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            days_of_week:
                                                                prev.days_of_week.includes(
                                                                    day,
                                                                )
                                                                    ? prev.days_of_week.filter(
                                                                          (d) =>
                                                                              d !==
                                                                              day,
                                                                      )
                                                                    : [
                                                                          ...prev.days_of_week,
                                                                          day,
                                                                      ],
                                                        }))
                                                    }
                                                />
                                                {day}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <Select
                                    label="Experience Level"
                                    value={form.experience_level}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            experience_level: e.target.value,
                                        })
                                    }
                                    options={[
                                        {
                                            value: "Beginner",
                                            label: "Beginner",
                                        },
                                        {
                                            value: "Intermediate",
                                            label: "Intermediate",
                                        },
                                        {
                                            value: "Advanced",
                                            label: "Advanced",
                                        },
                                    ]}
                                />
                                <Select
                                    label="Admission Test"
                                    value={form.admission_test}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            admission_test: e.target.value,
                                        })
                                    }
                                    options={[
                                        { value: "Yes", label: "Yes" },
                                        { value: "No", label: "No" },
                                    ]}
                                />
                                <Select
                                    label="Interview Required"
                                    value={form.interview}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            interview: e.target.value,
                                        })
                                    }
                                    options={[
                                        { value: "Yes", label: "Yes" },
                                        { value: "No", label: "No" },
                                    ]}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Required Skills
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SKILL_OPTIONS.map((skill) => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => toggleSkill(skill)}
                                            className={`px-3 py-1 rounded-md border ${form.required_skills.includes(skill) ? "bg-slate-900 text-white" : "bg-white text-slate-600"}`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        Learning Outcomes
                                    </label>
                                    <textarea
                                        className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700"
                                        rows={4}
                                        value={form.outcomes}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                outcomes: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Capabilities and Projects
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {PROJECT_OPTIONS.map((proj) => (
                                            <button
                                                key={proj}
                                                type="button"
                                                onClick={() =>
                                                    toggleProject(proj)
                                                }
                                                className={`px-3 py-1 rounded-md border ${form.projects.includes(proj) ? "bg-emerald-600 text-white" : "bg-white text-slate-600"}`}
                                            >
                                                {proj}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Certificate / Portfolio
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {CERTIFICATE_OPTIONS.map((cert) => (
                                        <label
                                            key={cert}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={form.certificates.includes(
                                                    cert,
                                                )}
                                                onChange={() =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        certificates:
                                                            prev.certificates.includes(
                                                                cert,
                                                            )
                                                                ? prev.certificates.filter(
                                                                      (c) =>
                                                                          c !==
                                                                          cert,
                                                                  )
                                                                : [
                                                                      ...prev.certificates,
                                                                      cert,
                                                                  ],
                                                    }))
                                                }
                                            />
                                            {cert}
                                        </label>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={form.portfolio}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    portfolio: e.target.checked,
                                                })
                                            }
                                        />
                                        Portfolio Support
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={form.recommendation}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    recommendation:
                                                        e.target.checked,
                                                })
                                            }
                                        />
                                        Recommendation Letter
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-700">
                                            Training Team
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            Add instructors, mentors, and
                                            reviewers.
                                        </div>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={addTeamMember}
                                    >
                                        Add Role
                                    </Button>
                                </div>
                                {form.training_team.map((member, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
                                    >
                                        <Input
                                            label="Role"
                                            value={member.role}
                                            onChange={(e) =>
                                                updateTeamMember(
                                                    index,
                                                    "role",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <Input
                                            label="Name"
                                            value={member.name}
                                            onChange={(e) =>
                                                updateTeamMember(
                                                    index,
                                                    "name",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() =>
                                                removeTeamMember(index)
                                            }
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                {form.training_team.length === 0 && (
                                    <div className="text-slate-500 text-sm">
                                        No training team members added yet.
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <Input
                                    label="Price"
                                    type="number"
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            price: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    label="Discount"
                                    type="number"
                                    value={form.discount}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            discount: e.target.value,
                                        })
                                    }
                                />
                                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                                    <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">
                                        Final Fee
                                    </div>
                                    <div className="text-xl font-semibold text-slate-900">
                                        ${finalPrice}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <Select
                                    label="Work Simulation"
                                    value={form.work_simulation}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            work_simulation: e.target.value,
                                        })
                                    }
                                    options={WORK_SIMULATION.map((p) => ({
                                        value: p,
                                        label: p,
                                    }))}
                                />
                                <Select
                                    label="Team Size"
                                    value={form.team_size}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            team_size: e.target.value,
                                        })
                                    }
                                    options={[
                                        { value: 3, label: "3 Developers" },
                                        { value: 5, label: "5 Developers" },
                                        { value: 8, label: "8 Developers" },
                                    ]}
                                />
                                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                                    <div className="text-[10px] uppercase tracking-wider text-slate-500">
                                        Seats Remaining
                                    </div>
                                    <div className="text-xl font-semibold text-slate-900">
                                        {availableSeats}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={form.git_repo_access}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                git_repo_access:
                                                    e.target.checked,
                                            })
                                        }
                                    />
                                    Git Repo Access
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={form.code_review}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                code_review: e.target.checked,
                                            })
                                        }
                                    />
                                    Code Review Included
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={form.final_deployment}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                final_deployment:
                                                    e.target.checked,
                                            })
                                        }
                                    />
                                    Final Deployment Included
                                </label>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <Input
                                label="Program Title"
                                value={form.title}
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                            />
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700"
                                    rows={4}
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Input
                                    label="Price"
                                    type="number"
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            price: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    label="Capacity"
                                    type="number"
                                    value={form.max_capacity}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            max_capacity: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <Select
                                label="Status"
                                value={form.status}
                                onChange={(e) =>
                                    setForm({ ...form, status: e.target.value })
                                }
                                options={[
                                    { value: "draft", label: "Draft" },
                                    { value: "published", label: "Published" },
                                    {
                                        value: "registration_open",
                                        label: "Registration Open",
                                    },
                                    {
                                        value: "registration_closed",
                                        label: "Registration Closed",
                                    },
                                    { value: "running", label: "Running" },
                                    { value: "completed", label: "Completed" },
                                    { value: "cancelled", label: "Cancelled" },
                                ]}
                            />
                        </div>
                    )}
                </form>
            </Modal>
        </div>
    );
};

export default TrainingPrograms;
