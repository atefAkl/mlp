import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ResourceHeader from "../components/organisms/ResourceHeader";
import ResourceFilters from "../components/organisms/ResourceFilters";
import Pagination from "../components/molecules/Pagination";
import Modal from "../components/organisms/Modal";
import { Input, Select } from "../components/atoms/FormElements";
import Button from "../components/atoms/Button";
import { toast } from "react-toastify";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
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
    const [modalMode, setModalMode] = useState("create");
    const [currentProgram, setCurrentProgram] = useState(null);
    const isEditing = modalMode === "edit";
    const isViewing = modalMode === "view";
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
    } = useGetTrainingProgramsQuery({ search: query, page: currentPage });
    const [createProgram] = useCreateTrainingProgramMutation();
    const [updateProgram] = useUpdateTrainingProgramMutation();
    const [deleteProgram] = useDeleteTrainingProgramMutation();

    const programs = Array.isArray(programsData?.data) ? programsData.data : [];
    const totalItems = programsData?.meta?.total ?? programs.length;
    const visiblePrograms = programs;
    const displayCount =
        totalItems === 0 ? 0 : Math.min(itemsPerPage, totalItems);

    const openCreate = () => {
        setModalMode("create");
        setCurrentProgram(null);
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
            training_type: "",
            project_type: "",
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

    const openProgramDetails = (program) => {
        setCurrentProgram(program);
        setModalMode("view");
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

    const openEdit = (program) => {
        setCurrentProgram(program);
        setModalMode("edit");
        setEditProgram(program);
        setForm({
            title: program.title || program.name || "",
            code: program.code || "",
            slug: program.slug || "",
            short_description: program.short_description || "",
            description: program.description || "",
            cover_image: program.cover_image || null,
            intro_video: program.intro_video || null,
            training_type: program.training_type || program.project_type || "",
            project_type: program.project_type || "",
            product_target: program.product_target || "",
            tech_stack: program.tech_stack || [],
            methodology: program.methodology || "",
            training_mode: program.training_mode || "",
            start_date: program.start_date || "",
            end_date: program.end_date || "",
            duration_weeks: program.duration_weeks || "",
            weekly_hours: program.weekly_hours || "",
            days_of_week: program.days_of_week || [],
            min_capacity: program.min_capacity || "",
            max_capacity: program.capacity ?? program.max_capacity ?? "",
            enrolled: program.enrolled || 0,
            required_skills:
                program.required_skills ||
                program.skills?.map((skill) => skill.name) ||
                [],
            experience_level:
                program.experience_level || program.level || "Beginner",
            admission_test: program.admission_test_required ? "Yes" : "No",
            interview: program.interview_required ? "Yes" : "No",
            outcomes: program.outcomes || "",
            projects: program.projects || [],
            certificates: program.certificates || [],
            portfolio:
                program.portfolio_available ?? program.portfolio ?? false,
            recommendation: program.recommendation || false,
            training_team: program.training_team || [],
            price: program.price ?? "",
            discount: program.discount_price ?? program.discount ?? "",
            installment_available: program.installment_available || false,
            installments_count: program.installments_count || 0,
            work_simulation: program.work_simulation || "",
            team_size: program.team_size || "",
            git_repo_access: program.git_repo_access || false,
            code_review: program.code_review || false,
            sprint_planning: program.sprint_planning || false,
            daily_standup: program.daily_standup || false,
            final_deployment: program.final_deployment || false,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = buildProgramPayload(form);
            if (modalMode === "edit" && editProgram) {
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
            setModalMode("create");
            setEditProgram(null);
            setCurrentProgram(null);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this program?")) return;
        try {
            await deleteProgram(id).unwrap();
            toast.success("Deleted");
            setIsModalOpen(false);
            setCurrentProgram(null);
            setEditProgram(null);
            setModalMode("create");
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Error deleting program");
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
                        ? i18n.language === "ar"
                            ? "لا توجد برامج محملة بعد"
                            : "No programs loaded yet"
                        : i18n.language === "ar"
                          ? `تم تحميل ${totalItems} برنامج`
                          : `${totalItems} programs loaded`
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
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            icon={faEye}
                                                            tooltip={i18n.language === "ar" ? "عرض" : "View"}
                                                            className="p-2"
                                                            onClick={() => openProgramDetails(p)}
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            icon={faEdit}
                                                            className="p-2"
                                                            onClick={() =>
                                                                openEdit(p)
                                                            }
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            icon={faTrash}
                                                            className="p-2"
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
                                    className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md smooth-transition"
                                >
                                    <div className="flex justify-between items-start gap-4 mb-3">
                                        <div className="font-bold text-slate-800">
                                            {p.title || p.name}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                icon={faEye}
                                                tooltip="View"
                                                className="p-2"
                                                onClick={() =>
                                                    openProgramDetails(p)
                                                }
                                            />
                                            <Button
                                                variant="ghost"
                                                icon={faEdit}
                                                tooltip="Edit"
                                                className="p-2"
                                                onClick={() => openEdit(p)}
                                            />
                                            <Button
                                                variant="ghost"
                                                icon={faTrash}
                                                tooltip="Delete"
                                                className="p-2"
                                                onClick={() =>
                                                    handleDelete(p.id)
                                                }
                                            />
                                        </div>
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
                onClose={() => {
                    setIsModalOpen(false);
                    setModalMode("create");
                    setCurrentProgram(null);
                    setEditProgram(null);
                }}
                title={
                    modalMode === "edit"
                        ? "Edit Program"
                        : modalMode === "view"
                          ? "Program Details"
                          : "Create Program"
                }
                size="4xl"
                footer={
                    <>
                        {modalMode === "edit" && editProgram && (
                            <Button
                                variant="danger"
                                onClick={() => handleDelete(editProgram.id)}
                                type="button"
                                className="px-5 py-2.5 rounded-md"
                            >
                                Delete Program
                            </Button>
                        )}
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setIsModalOpen(false);
                                setModalMode("create");
                                setEditProgram(null);
                                setCurrentProgram(null);
                            }}
                            type="button"
                            className="px-5 py-2.5 rounded-md"
                        >
                            Cancel
                        </Button>
                        {modalMode !== "view" && (
                            <Button
                                variant="primary"
                                type="submit"
                                onClick={handleSubmit}
                                className="px-5 py-2.5 rounded-md min-w-[140px] bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {modalMode === "edit"
                                    ? "Save Program"
                                    : "Create Program"}
                            </Button>
                        )}
                    </>
                }
            >
                {isViewing ? (
                    <div className="space-y-6 text-sm text-slate-700">
                        {/* Hero Section */}
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-5 rounded-2xl border border-slate-200">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        {i18n.language === "ar" ? "اسم البرنامج" : "Program Title"}
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                                        {currentProgram?.title || currentProgram?.name || "-"}
                                    </h2>
                                    {currentProgram?.code && (
                                        <span className="inline-block bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono mt-2">
                                            {i18n.language === "ar" ? "الكود" : "Code"}: {currentProgram.code}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                        currentProgram?.status === "published" 
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                            : currentProgram?.status === "registration_open"
                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                            : "bg-slate-50 text-slate-700 border-slate-200"
                                    }`}>
                                        {currentProgram?.status === "draft" && (i18n.language === "ar" ? "مسودة" : "Draft")}
                                        {currentProgram?.status === "published" && (i18n.language === "ar" ? "منشور" : "Published")}
                                        {currentProgram?.status === "registration_open" && (i18n.language === "ar" ? "التسجيل مفتوح" : "Registration Open")}
                                        {currentProgram?.status === "registration_closed" && (i18n.language === "ar" ? "التسجيل مغلق" : "Registration Closed")}
                                        {currentProgram?.status === "running" && (i18n.language === "ar" ? "جاري حالياً" : "Running")}
                                        {currentProgram?.status === "completed" && (i18n.language === "ar" ? "مكتمل" : "Completed")}
                                        {currentProgram?.status === "cancelled" && (i18n.language === "ar" ? "ملغي" : "Cancelled")}
                                        {!["draft", "published", "registration_open", "registration_closed", "running", "completed", "cancelled"].includes(currentProgram?.status) && (currentProgram?.status || "draft")}
                                    </span>
                                    {(currentProgram?.level || currentProgram?.experience_level) && (
                                        <span className="px-3 py-1 bg-violet-50 text-violet-700 border border-violet-200 rounded-full text-xs font-semibold">
                                            {currentProgram.level || currentProgram.experience_level}
                                        </span>
                                    )}
                                    {(currentProgram?.training_type || currentProgram?.project_type) && (
                                        <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                                            {currentProgram?.training_type || currentProgram?.project_type}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column (Details & Outcomes) - 2/3 Width */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Description */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">
                                        {i18n.language === "ar" ? "وصف البرنامج" : "Program Description"}
                                    </h3>
                                    {currentProgram?.short_description && (
                                        <p className="text-slate-500 italic text-xs leading-relaxed">
                                            {currentProgram.short_description}
                                        </p>
                                    )}
                                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                        {currentProgram?.description || (i18n.language === "ar" ? "لا يوجد وصف متاح." : "No description available.")}
                                    </p>
                                </div>

                                {/* Required Skills */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">
                                        {i18n.language === "ar" ? "المهارات المطلوبة" : "Required Skills"}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {(currentProgram?.required_skills || currentProgram?.skills?.map(s => s.name || s) || []).length > 0 ? (
                                            (currentProgram?.required_skills || currentProgram?.skills?.map(s => s.name || s) || []).map((skill) => (
                                                <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-400 italic text-xs">
                                                {i18n.language === "ar" ? "لا توجد مهارات محددة مطلوبة." : "No specific skills required."}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Outcomes & Projects */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                    <div>
                                        <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">
                                            {i18n.language === "ar" ? "مخرجات التعلم" : "Learning Outcomes"}
                                        </h3>
                                        <p className="text-slate-700 mt-2 leading-relaxed whitespace-pre-wrap">
                                            {currentProgram?.outcomes || (i18n.language === "ar" ? "لم يتم تحديد مخرجات التعلم بعد." : "No outcomes listed.")}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-600 text-xs uppercase tracking-wider mt-4 mb-2">
                                            {i18n.language === "ar" ? "المشاريع المشمولة" : "Projects Included"}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {(currentProgram?.projects || []).length > 0 ? (
                                                (currentProgram?.projects || []).map((proj) => (
                                                    <span key={proj} className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-xs font-semibold">
                                                        {proj}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-slate-400 italic text-xs">
                                                    {i18n.language === "ar" ? "لا توجد مشاريع محددة." : "No projects listed."}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Training Team */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">
                                        {i18n.language === "ar" ? "فريق التدريب" : "Training Team"}
                                    </h3>
                                    {(currentProgram?.training_team || []).length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                            {(currentProgram.training_team).map((member, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                                                        {member.name ? member.name[0].toUpperCase() : "?"}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-800 text-xs">{member.name || "-"}</div>
                                                        <div className="text-[10px] text-slate-400 uppercase font-semibold">{member.role || (i18n.language === "ar" ? "عضو فريق" : "Team Member")}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-400 italic text-xs">
                                            {i18n.language === "ar" ? "لا يوجد أعضاء معينين لفريق التدريب بعد." : "No training team members assigned."}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Right Column (Metrics & Configurations) - 1/3 Width */}
                            <div className="space-y-6">
                                {/* Program Pricing */}
                                <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-4">
                                    <h3 className="font-bold border-b border-slate-800 pb-2 text-slate-400">
                                        {i18n.language === "ar" ? "تفاصيل الرسوم" : "Pricing Details"}
                                    </h3>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-400">{i18n.language === "ar" ? "الرسوم الأساسية" : "Original Price"}</span>
                                        <span className="font-bold text-lg font-mono">
                                            {currentProgram?.price === 0 
                                                ? (i18n.language === "ar" ? "مجاني" : "Free") 
                                                : currentProgram?.price 
                                                ? `${currentProgram.price} ${i18n.language === "ar" ? "دولار" : "USD"}` 
                                                : "-"}
                                        </span>
                                    </div>
                                    {(currentProgram?.discount_price != null || currentProgram?.discount != null) && (
                                        <div className="flex justify-between items-center text-rose-400">
                                            <span className="text-xs">{i18n.language === "ar" ? "قيمة الخصم" : "Discount"}</span>
                                            <span className="font-bold font-mono">-${currentProgram.discount_price || currentProgram.discount}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-300">{i18n.language === "ar" ? "الرسوم النهائية" : "Final Fee"}</span>
                                        <span className="text-2xl font-black font-mono text-emerald-400">
                                            {currentProgram?.price === 0 
                                                ? (i18n.language === "ar" ? "مجاني" : "Free") 
                                                : currentProgram?.price 
                                                ? `${Math.max(0, Number(currentProgram.price) - Number(currentProgram.discount_price || currentProgram.discount || 0))} ${i18n.language === "ar" ? "دولار" : "USD"}` 
                                                : "-"}
                                        </span>
                                    </div>
                                </div>

                                {/* Logistics & Dates */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">
                                        {i18n.language === "ar" ? "الجدول والقدرة الاستيعابية" : "Schedule & Capacity"}
                                    </h3>
                                    <div className="space-y-3 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{i18n.language === "ar" ? "المدة" : "Duration"}</span>
                                            <span className="font-semibold text-slate-800">
                                                {currentProgram?.duration_weeks 
                                                    ? `${currentProgram.duration_weeks} ${i18n.language === "ar" ? "أسابيع" : "Weeks"}` 
                                                    : "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{i18n.language === "ar" ? "الساعات الأسبوعية" : "Weekly Hours"}</span>
                                            <span className="font-semibold text-slate-800">
                                                {currentProgram?.weekly_hours 
                                                    ? `${currentProgram.weekly_hours} ${i18n.language === "ar" ? "ساعة/أسبوع" : "Hours/Week"}` 
                                                    : "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{i18n.language === "ar" ? "تاريخ البدء" : "Start Date"}</span>
                                            <span className="font-semibold text-slate-800">{currentProgram?.start_date || "-"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{i18n.language === "ar" ? "تاريخ الانتهاء" : "End Date"}</span>
                                            <span className="font-semibold text-slate-800">{currentProgram?.end_date || "-"}</span>
                                        </div>
                                        <hr className="border-slate-100" />
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{i18n.language === "ar" ? "المقاعد الكلية" : "Total Capacity"}</span>
                                            <span className="font-semibold text-slate-800">{currentProgram?.capacity || currentProgram?.max_capacity || "-"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{i18n.language === "ar" ? "الطلاب المسجلين" : "Enrolled Students"}</span>
                                            <span className="font-semibold text-slate-800">{currentProgram?.enrolled || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{i18n.language === "ar" ? "المقاعد الشاغرة" : "Available Seats"}</span>
                                            <span className="font-bold text-emerald-600">
                                                {currentProgram?.capacity || currentProgram?.max_capacity
                                                    ? Math.max(0, (Number(currentProgram.capacity || currentProgram.max_capacity) - Number(currentProgram.enrolled || 0)))
                                                    : "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Work Simulation config */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">
                                        {i18n.language === "ar" ? "بيئة العمل الافتراضية" : "Work Simulation"}
                                    </h3>
                                    <div className="space-y-3 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{i18n.language === "ar" ? "نوع محاكاة العمل" : "Simulation Type"}</span>
                                            <span className="font-semibold text-slate-800">{currentProgram?.work_simulation || "-"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{i18n.language === "ar" ? "حجم الفريق" : "Team Size"}</span>
                                            <span className="font-semibold text-slate-800">
                                                {currentProgram?.team_size 
                                                    ? `${currentProgram.team_size} ${i18n.language === "ar" ? "مطورين" : "Developers"}` 
                                                    : "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{i18n.language === "ar" ? "منهجية العمل" : "Methodology"}</span>
                                            <span className="font-semibold text-slate-800">{currentProgram?.methodology || "-"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checklist / Features */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">
                                        {i18n.language === "ar" ? "مزايا البرنامج" : "Program Features"}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${currentProgram?.certificate_available ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                                            <span className={currentProgram?.certificate_available ? "text-slate-800 font-semibold" : "text-slate-400"}>
                                                {i18n.language === "ar" ? "شهادة إتمام" : "Certificate"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${currentProgram?.portfolio_available || currentProgram?.portfolio ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                                            <span className={currentProgram?.portfolio_available || currentProgram?.portfolio ? "text-slate-800 font-semibold" : "text-slate-400"}>
                                                {i18n.language === "ar" ? "دعم المعرض" : "Portfolio Help"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${currentProgram?.recommendation ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                                            <span className={currentProgram?.recommendation ? "text-slate-800 font-semibold" : "text-slate-400"}>
                                                {i18n.language === "ar" ? "خطاب توصية" : "Recommendation"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${currentProgram?.git_repo_access ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                                            <span className={currentProgram?.git_repo_access ? "text-slate-800 font-semibold" : "text-slate-400"}>
                                                {i18n.language === "ar" ? "مستودع Git" : "Git Repo Access"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${currentProgram?.code_review ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                                            <span className={currentProgram?.code_review ? "text-slate-800 font-semibold" : "text-slate-400"}>
                                                {i18n.language === "ar" ? "مراجعة الكود" : "Code Reviews"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${currentProgram?.final_deployment ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                                            <span className={currentProgram?.final_deployment ? "text-slate-800 font-semibold" : "text-slate-400"}>
                                                {i18n.language === "ar" ? "نشر نهائي" : "Final Deployment"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${currentProgram?.admission_test_required ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                                            <span className={currentProgram?.admission_test_required ? "text-slate-800 font-semibold" : "text-slate-400"}>
                                                {i18n.language === "ar" ? "اختبار قبول" : "Admission Test"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${currentProgram?.interview_required ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                                            <span className={currentProgram?.interview_required ? "text-slate-800 font-semibold" : "text-slate-400"}>
                                                {i18n.language === "ar" ? "مقابلة شخصية" : "Interview Req."}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
            </Modal>
        </div>
    );
};

export default TrainingPrograms;
