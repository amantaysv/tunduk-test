import { IoArrowBack } from "react-icons/io5";
import { Link, useParams, useSearchParams } from "react-router";

import CriteriaList from "@/components/CandidateDetail/CriteriaList";
import ExperienceList from "@/components/CandidateDetail/ExperienceList";
import StatusSelect from "@/components/CandidateDetail/StatusSelect";
import VerdictBadge from "@/components/UI/VerdictBadge";
import { useCandidates } from "@/hooks/useCandidates";
import { useCandidatesStore } from "@/store";

export default function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { loading, error } = useCandidates();
  const candidate = useCandidatesStore((s) =>
    s.candidates.find((c) => c.id === id)
  );

  const backUrl = `/candidates?${searchParams.toString()}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
        <span className="sr-only">Загрузка...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16" role="alert">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          404 — Кандидат не найден
        </h2>
        <p className="text-gray-500 mb-6">Запись с ID «{id}» не существует.</p>
        <Link
          to={backUrl}
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <IoArrowBack /> Назад к списку
        </Link>
      </div>
    );
  }

  const {
    name,
    pos_label,
    email,
    phone,
    city,
    tg,
    exp,
    total_exp,
    stack,
    edu,
    verdict,
    vc,
    criteria,
    summary,
    questions,
    status,
  } = candidate;

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      {/* Back button */}
      <Link
        to={backUrl}
        className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <IoArrowBack /> Назад к списку
      </Link>

      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4 mb-6 p-4 bg-white border border-gray-300 rounded-xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pos_label}</p>
          <div className="mt-2">
            <VerdictBadge verdict={verdict} vc={vc} size="md" />
          </div>
        </div>
        <StatusSelect candidateId={candidate.id} currentStatus={status} />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <aside className="space-y-6">
          {/* Contacts */}
          <section className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">Контакты</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd>
                  <a
                    href={`mailto:${email}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Телефон</dt>
                <dd>
                  <a
                    href={`tel:${phone}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Telegram</dt>
                <dd className="text-gray-900">{tg}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Город</dt>
                <dd className="text-gray-900">{city}</dd>
              </div>
            </dl>
          </section>

          {/* Info */}
          <section className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">О кандидате</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Общий опыт</dt>
                <dd className="font-medium text-gray-900">{total_exp}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Образование</dt>
                <dd className="text-gray-900">{edu}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Стек</dt>
                <dd className="text-gray-900">{stack}</dd>
              </div>
            </dl>
          </section>
        </aside>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <section className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-2">Summary</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          </section>

          {/* Experience */}
          <section className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Опыт работы</h2>
            <ExperienceList exp={exp} />
          </section>

          {/* Criteria */}
          <section className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">
              Критерии оценки
            </h2>
            <CriteriaList criteria={criteria} />
          </section>

          {/* Questions */}
          <section className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">
              Вопросы для собеседования
            </h2>
            <ol className="space-y-2">
              {questions.map((q, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="font-bold text-indigo-500 shrink-0">
                    {i + 1}.
                  </span>
                  {q}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </main>
  );
}
