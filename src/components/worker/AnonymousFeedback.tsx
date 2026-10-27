import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import {
  Star,
  ShieldCheck,
  Send,
  CheckCircle2,
  Lock,
  HeartHandshake,
  Coffee,
  Sparkles,
} from 'lucide-react';

export const AnonymousFeedback: React.FC = () => {
  const { submitFeedback, sectorData, t } = useFairShift();

  const [ratingManager, setRatingManager] = useState(4);
  const [ratingConditions, setRatingConditions] = useState(4);
  const [ratingRestBreaks, setRatingRestBreaks] = useState(3);
  const [ratingFairShifts, setRatingFairShifts] = useState(4);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback({
      ratingManager,
      ratingConditions,
      ratingRestBreaks,
      ratingFairShifts,
      anonymousComment: comment.trim() || undefined,
    });

    setComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const StarRatingSelector = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (val: number) => void;
    label: string;
  }) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
        <span>{label}</span>
        <span className="font-mono text-blue-700 font-extrabold">{value} / 5</span>
      </div>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            aria-label={`Rate ${star} out of 5 for ${label}`}
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-100 active:scale-95"
          >
            <Star
              className={`w-5 h-5 ${
                star <= value ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      {/* Title Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <h2 className="text-lg font-bold text-slate-900 leading-tight">
          {t.feedbackTitle}
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t.feedbackSubtitle}
        </p>

        {/* Privacy Decoupling Guarantee Badge */}
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="font-medium text-[11px] leading-relaxed">
            {t.privacyGuarantee}
          </p>
        </div>
      </div>

      {/* Feedback Rating Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <StarRatingSelector
          label={t.rateManager}
          value={ratingManager}
          onChange={setRatingManager}
        />

        <StarRatingSelector
          label={t.rateConditions}
          value={ratingConditions}
          onChange={setRatingConditions}
        />

        <StarRatingSelector
          label={t.rateRestBreaks}
          value={ratingRestBreaks}
          onChange={setRatingRestBreaks}
        />

        <StarRatingSelector
          label={t.rateFairShifts}
          value={ratingFairShifts}
          onChange={setRatingFairShifts}
        />

        {/* Anonymous Comment */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {t.optionalComment}
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t.commentPlaceholder}
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 text-slate-900"
          />
        </div>

        <button
          type="submit"
          aria-label={t.submitFeedback}
          className="w-full h-12 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform"
        >
          <Send className="w-4 h-4" />
          <span>{t.submitFeedback}</span>
        </button>

        {submitted && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.feedbackSuccess}</span>
          </div>
        )}
      </form>

      {/* Aggregated Anonymous Sentiment in Sector */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
          Recent Anonymous Site Voices
        </h3>
        <div className="space-y-2">
          {sectorData.feedback.slice(0, 3).map((fb) => (
            <div
              key={fb.id}
              className="bg-white p-3 rounded-2xl border border-slate-200 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span className="flex items-center gap-1 font-semibold text-amber-700">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  Avg: {((fb.ratingManager + fb.ratingConditions + fb.ratingRestBreaks + fb.ratingFairShifts) / 4).toFixed(1)} / 5
                </span>
                <span>{new Date(fb.timestamp).toLocaleDateString()}</span>
              </div>
              {fb.anonymousComment && (
                <p className="text-slate-700 italic">
                  "{fb.anonymousComment}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
