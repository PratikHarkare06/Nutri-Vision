import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { saveProfileRequest } from "../services/profileApi";

type OnboardingWizardProps = {
  onComplete: () => void;
};

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const { user, setHasCompletedProfile } = useAuthStore();

  // Onboarding Form States
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Female");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("Moderately Active");
  const [dietMode, setDietMode] = useState("Balanced");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [foodAllergies, setFoodAllergies] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRestrictionToggle = (r: string) => {
    setDietaryRestrictions(prev =>
      prev.includes(r) ? prev.filter(item => item !== r) : [...prev, r]
    );
  };

  const handleAllergyToggle = (a: string) => {
    setFoodAllergies(prev =>
      prev.includes(a) ? prev.filter(item => item !== a) : [...prev, a]
    );
  };

  const nextStep = () => {
    setErrorMsg("");
    if (step === 1) {
      if (!fullName || !age || !height || !weight) {
        setErrorMsg("Please fill in all personal details.");
        return;
      }
      if (Number(age) <= 0 || Number(height) <= 0 || Number(weight) <= 0) {
        setErrorMsg("Please enter valid positive numbers.");
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setErrorMsg("");
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        fullName,
        email,
        age: Number(age),
        gender,
        height: Number(height),
        weight: Number(weight),
        activityLevel,
        dietMode,
        dietaryRestrictions,
        foodAllergies,
      };

      const res = await saveProfileRequest(payload);
      if (res.success) {
        setHasCompletedProfile(true);
        onComplete();
      } else {
        setErrorMsg("Failed to save profile. Try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit onboarding profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-[32px] border border-[#E2E4DC] shadow-2xl overflow-hidden my-8">
        
        {/* Progress Bar Header */}
        <div className="bg-[#F5F6F1] px-8 py-6 border-b border-[#E2E4DC]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-wider">Onboarding Wizard</span>
              <h2 className="text-xl font-black text-[#2C2C2C] mt-0.5">Let's Personalize Your Plan</h2>
            </div>
            <span className="text-xs font-bold text-[#7A9E7E] bg-white border border-[#E2E4DC] px-3 py-1.5 rounded-xl">
              Step {step} of 3
            </span>
          </div>
          {/* Progress Indicator */}
          <div className="w-full h-2 bg-[#E2E4DC] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#7A9E7E] transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-8 mt-6 bg-[#E8815A]/10 border border-[#E8815A]/20 text-[#E8815A] rounded-2xl p-4 text-xs font-semibold flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* STEP 1: Personal Telemetry */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-b border-[#E2E4DC] pb-2 mb-4">
                <h3 className="text-sm font-black text-[#2C2C2C]">Step 1: Bio-Data & Telemetry</h3>
                <p className="text-xs text-[#7A7A7A] mt-0.5">This allows our algorithms to calculate accurate caloric bounds, BMI, and hydration goals.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C2C2C] uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#F5F6F1]/50 border border-[#E2E4DC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7A9E7E] focus:bg-white text-[#2C2C2C] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2C2C2C] uppercase tracking-wider mb-2">Age</label>
                  <input
                    type="number"
                    placeholder="e.g. 28"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-[#F5F6F1]/50 border border-[#E2E4DC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7A9E7E] focus:bg-white text-[#2C2C2C] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C2C2C] uppercase tracking-wider mb-2">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-[#F5F6F1]/50 border border-[#E2E4DC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7A9E7E] focus:bg-white text-[#2C2C2C] transition-all"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer Not to Say">Prefer Not to Say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2C2C2C] uppercase tracking-wider mb-2">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="e.g. 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-[#F5F6F1]/50 border border-[#E2E4DC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7A9E7E] focus:bg-white text-[#2C2C2C] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2C2C2C] uppercase tracking-wider mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-[#F5F6F1]/50 border border-[#E2E4DC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7A9E7E] focus:bg-white text-[#2C2C2C] transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Lifestyle & Goals */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-[#E2E4DC] pb-2">
                <h3 className="text-sm font-black text-[#2C2C2C]">Step 2: Lifestyle & Caloric Targets</h3>
                <p className="text-xs text-[#7A7A7A] mt-0.5">Define your daily activity level and dietary strategy.</p>
              </div>

              {/* Activity Level selection */}
              <div>
                <label className="block text-xs font-bold text-[#2C2C2C] uppercase tracking-wider mb-3">Daily Activity Level</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: "Sedentary", desc: "Desk job, little to no structured workouts." },
                    { name: "Lightly Active", desc: "Light workouts or active walks 1-3 days/week." },
                    { name: "Moderately Active", desc: "Structured workouts 3-5 days/week." },
                    { name: "Very Active", desc: "Intense athletic workouts 6-7 days/week." }
                  ].map((act) => (
                    <button
                      key={act.name}
                      type="button"
                      onClick={() => setActivityLevel(act.name)}
                      className={`text-left p-4 rounded-2xl border transition-all ${
                        activityLevel === act.name
                          ? "border-[#7A9E7E] bg-[#7A9E7E]/5 text-[#2C2C2C]"
                          : "border-[#E2E4DC] hover:border-[#7A9E7E]/50 text-[#7A7A7A]"
                      }`}
                    >
                      <h4 className="text-xs font-bold text-[#2C2C2C]">{act.name}</h4>
                      <p className="text-[10px] mt-1 opacity-90">{act.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet Mode selection */}
              <div>
                <label className="block text-xs font-bold text-[#2C2C2C] uppercase tracking-wider mb-3">Dietary Strategy (Diet Mode)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: "Balanced", color: "hover:text-[#7A9E7E]" },
                    { name: "Keto (Low Carb)", color: "hover:text-[#E8815A]" },
                    { name: "High Protein", color: "hover:text-[#7A9EBE]" },
                    { name: "Low Fat", color: "hover:text-[#7A9E7E]" }
                  ].map((diet) => (
                    <button
                      key={diet.name}
                      type="button"
                      onClick={() => setDietMode(diet.name)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        dietMode === diet.name
                          ? "border-[#7A9E7E] bg-[#7A9E7E]/10 text-[#2C2C2C] scale-[1.03]"
                          : `border-[#E2E4DC] text-[#7A7A7A] ${diet.color}`
                      }`}
                    >
                      {diet.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Allergies & Restrictions */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-[#E2E4DC] pb-2">
                <h3 className="text-sm font-black text-[#2C2C2C]">Step 3: Food Allergies & Restrictions</h3>
                <p className="text-xs text-[#7A7A7A] mt-0.5">Let the AI meal generator know what foods to restrict or substitute.</p>
              </div>

              {/* Dietary Restrictions */}
              <div>
                <label className="block text-xs font-bold text-[#2C2C2C] uppercase tracking-wider mb-3">Dietary Restrictions</label>
                <div className="flex flex-wrap gap-2">
                  {["Vegetarian", "Gluten-Free", "Nut-Free", "Vegan"].map(r => {
                    const active = dietaryRestrictions.includes(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRestrictionToggle(r)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                          active
                            ? "bg-[#7A9E7E] text-white border-[#7A9E7E]"
                            : "bg-white text-[#7A7A7A] border-[#E2E4DC] hover:border-[#7A9E7E]/50"
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Food Allergies */}
              <div>
                <label className="block text-xs font-bold text-[#2C2C2C] uppercase tracking-wider mb-3">Allergies (Avoid Entirely)</label>
                <div className="flex flex-wrap gap-2">
                  {["Shellfish", "Eggs", "Soy", "Fish", "Sesame"].map(a => {
                    const active = foodAllergies.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => handleAllergyToggle(a)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                          active
                            ? "bg-[#E8815A] text-white border-[#E8815A]"
                            : "bg-white text-[#7A7A7A] border-[#E2E4DC] hover:border-[#E8815A]/50"
                        }`}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between border-t border-[#E2E4DC] pt-6 mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-[#E2E4DC] hover:border-[#2C2C2C] text-[#2C2C2C] font-bold rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7-7m-7 7h18" />
                </svg>
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-[#7A9E7E] hover:bg-[#68876c] text-white font-bold rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2"
              >
                Continue
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#7A9E7E] hover:bg-[#68876c] disabled:opacity-50 text-white font-bold rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Complete & Unlock App
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}
