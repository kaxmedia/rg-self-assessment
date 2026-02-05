(function () {
    const root = document.querySelector("#rgsa-root .rgsa-app");
    if (!root || !window.RGSA_DATA || !Array.isArray(window.RGSA_DATA.steps)) return;

    const steps = window.RGSA_DATA.steps;
    const totalSteps = steps.length;

    let current = 0;
    const state = {}; // sve u memoriji (ne čuva se nigde)

    function percentComplete(stepIndex) {
        // GambleAware-like: prikaz napretka kroz pitanja (bez rezultata kao posebnog koraka)
        const p = Math.round(((stepIndex) / (totalSteps - 1)) * 100);
        return Math.max(0, Math.min(100, p));
    }

    function el(tag, attrs = {}, children = []) {
        const e = document.createElement(tag);
        Object.entries(attrs).forEach(([k, v]) => {
            if (k === "class") e.className = v;
            else if (k === "html") e.innerHTML = v;
            else e.setAttribute(k, v);
        });
        children.forEach((c) => e.appendChild(c));
        return e;
    }

    function clear(node) {
        while (node.firstChild) node.removeChild(node.firstChild);
    }

    function renderProgress(stepIndex) {
        const stepNum = Math.min(stepIndex + 1, totalSteps);
        const pct = percentComplete(stepIndex);

        return el("div", { class: "rgsa-progress" }, [
            el("div", { class: "rgsa-progress-top" }, [
                el("span", { html: `Question ${stepNum}` }),
                el("span", { html: `${pct}% Complete` }),
            ]),
            el("div", { class: "rgsa-progress-bar" }, [
                el("div", { class: "rgsa-progress-fill", style: `width:${pct}%` }),
            ]),
        ]);
    }

    function validateStep(step) {
        const val = state[step.id];

        if (!step.required) return { ok: true };

        if (step.type === "single") {
            if (val === undefined || val === null || val === "") return { ok: false, msg: "Please select an answer." };
            return { ok: true };
        }

        if (step.type === "multi") {
            if (!Array.isArray(val) || val.length === 0) return { ok: false, msg: "Please select at least one option." };
            return { ok: true };
        }

        return { ok: true };
    }

    function computeScore() {
        let score = 0;

        steps.forEach((s) => {
            const val = state[s.id];
            if (s.type === "single") {
                const opt = (s.options || []).find(o => String(o.value) === String(val));
                if (opt && typeof opt.score === "number") score += opt.score;
            }
            if (s.type === "multi") {
                if (!Array.isArray(val)) return;

                // none option => nema bodova, preskačemo ostalo
                if (val.includes("none")) return;

                val.forEach(v => {
                    const opt = (s.options || []).find(o => String(o.value) === String(v));
                    if (opt && typeof opt.score === "number") score += opt.score;
                });
            }
        });

        return score;
    }

    function riskFromScore(score) {
        if (score >= 12) return "high";
        if (score >= 6) return "moderate";
        return "low";
    }

    function copyForRisk(risk) {
        if (risk === "high") return {
            label: "High risk of harm",
            title: "Your answers indicate you are at high risk of harm from gambling.",
            message: "Completing this assessment can be tough, but it’s an important step toward taking control. Consider reaching out for support.",
        };
        if (risk === "moderate") return {
            label: "Moderate risk of harm",
            title: "Your answers indicate a moderate risk of harm from gambling.",
            message: "You may benefit from setting stronger limits and speaking to a support service.",
        };
        return {
            label: "Lower risk",
            title: "Your answers indicate a lower risk of harm from gambling.",
            message: "Even with lower risk, it can help to keep an eye on habits and use safer gambling tools.",
        };
    }

    function renderSingle(step) {
        const fieldset = el("div", { class: "rgsa-fieldset" });
        const legend = el("div", { class: "rgsa-legend" });
        legend.appendChild(el("span", { class: "rgsa-question-number", html: String(current + 1) }));
        legend.appendChild(el("span", { class: "rgsa-legend-text", html: step.title }));
        fieldset.appendChild(legend);

        if (step.subtitle) fieldset.appendChild(el("p", { class: "rgsa-subtitle", html: step.subtitle }));

        const optionsWrap = el("div", { class: "rgsa-options" });
        (step.options || []).forEach((opt, idx) => {
            const id = `${step.id}_${idx}`;
            const input = el("input", { type: "radio", id, name: step.id, value: String(opt.value) });
            if (String(state[step.id]) === String(opt.value)) input.checked = true;

            input.addEventListener("change", () => {
                state[step.id] = String(opt.value);
                render(); // refresh for button states
            });

            const label = el("label", { for: id, html: opt.label });
            const item = el("div", { class: "rgsa-option" }, [input, label]);
            optionsWrap.appendChild(item);
        });

        fieldset.appendChild(optionsWrap);
        return fieldset;
    }

    function renderMulti(step) {
        const fieldset = el("div", { class: "rgsa-fieldset" });
        const legend = el("div", { class: "rgsa-legend" });
        legend.appendChild(el("span", { class: "rgsa-question-number", html: String(current + 1) }));
        legend.appendChild(el("span", { class: "rgsa-legend-text", html: step.title }));
        fieldset.appendChild(legend);

        if (step.subtitle) fieldset.appendChild(el("p", { class: "rgsa-subtitle", html: step.subtitle }));

        const selected = Array.isArray(state[step.id]) ? state[step.id] : [];
        const optionsWrap = el("div", { class: "rgsa-options rgsa-options--multi" });

        // None option (kao “No”)
        if (step.hasNoneOption && step.noneOption) {
            const id = `${step.id}_none`;
            const input = el("input", { type: "checkbox", id, value: "none" });
            input.checked = selected.includes("none");

            input.addEventListener("change", () => {
                if (input.checked) {
                    state[step.id] = ["none"]; // briše ostalo
                } else {
                    state[step.id] = [];
                }
                render();
            });

            const label = el("label", { for: id, html: step.noneOption.label });
            optionsWrap.appendChild(el("div", { class: "rgsa-option rgsa-option--checkbox" }, [input, label]));
        }

        (step.options || []).forEach((opt, idx) => {
            const id = `${step.id}_${idx}`;
            const input = el("input", { type: "checkbox", id, value: String(opt.value) });
            input.checked = selected.includes(String(opt.value));

            input.addEventListener("change", () => {
                let cur = Array.isArray(state[step.id]) ? state[step.id].slice() : [];
                // ako je "none" bilo čekirano, skini ga čim odabereš nešto drugo
                cur = cur.filter(v => v !== "none");

                if (input.checked) cur.push(String(opt.value));
                else cur = cur.filter(v => v !== String(opt.value));

                state[step.id] = cur;
                render();
            });

            const label = el("label", { for: id, html: opt.label });
            optionsWrap.appendChild(el("div", { class: "rgsa-option rgsa-option--checkbox" }, [input, label]));
        });

        fieldset.appendChild(optionsWrap);
        return fieldset;
    }

    function renderOptional(step) {
        const wrap = el("div", { class: "rgsa-fieldset rgsa-fieldset--optional" });

        const title = el("div", { class: "rgsa-legend", html: step.title });
        wrap.appendChild(title);

        if (step.subtitle) wrap.appendChild(el("p", { class: "rgsa-subtitle", html: step.subtitle }));

        (step.fields || []).forEach((f) => {
            const fieldWrap = el("div", { class: "rgsa-optional-field" });
            fieldWrap.appendChild(el("div", { class: "rgsa-optional-label", html: f.label }));

            const optionsWrap = el("div", { class: "rgsa-optional-options" });
            const stateKey = `${step.id}.${f.id}`;

            (f.options || []).forEach((opt, idx) => {
                // Skip "Please select" placeholder
                if (opt === "Please select") return;

                const id = `${step.id}_${f.id}_${idx}`;
                const input = el("input", { type: "radio", id, name: stateKey, value: opt });

                if (state[stateKey] === opt) input.checked = true;

                input.addEventListener("change", () => {
                    state[stateKey] = opt;
                    render();
                });

                const label = el("label", { for: id, html: opt });
                const item = el("div", { class: "rgsa-optional-option" }, [input, label]);
                optionsWrap.appendChild(item);
            });

            fieldWrap.appendChild(optionsWrap);
            wrap.appendChild(fieldWrap);
        });

        return wrap;
    }

    function renderResults() {
        const score = computeScore();
        const risk = riskFromScore(score);
        const copy = copyForRisk(risk);

        const pct = 100;

        const results = el("div", { class: "rgsa-results" }, [
            el("div", { class: "rgsa-progress" }, [
                el("div", { class: "rgsa-progress-top" }, [
                    el("span", { html: "Complete" }),
                    el("span", { html: `${pct}% Complete` }),
                ]),
                el("div", { class: "rgsa-progress-bar" }, [
                    el("div", { class: "rgsa-progress-fill", style: `width:${pct}%` }),
                ]),
            ]),

            el("h2", { html: copy.title }),
            el("div", { class: "rgsa-result-card" }, [
                el("p", { class: "rgsa-result-label", html: copy.label }),
                el("p", { class: "rgsa-result-score", html: `Score: ${score}` }),
            ]),
            el("p", { class: "rgsa-subtitle", html: copy.message }),

            el("div", { class: "rgsa-nav" }, []),
        ]);

        // Retake dugme
        const retake = el("button", { type: "button", class: "rgsa-button rgsa-button--secondary" });
        retake.textContent = "Take the assessment again";
        retake.addEventListener("click", () => {
            for (const k in state) delete state[k];
            current = 0;
            render();
            window.scrollTo({ top: document.querySelector("#rgsa-root").offsetTop - 20, behavior: "smooth" });
        });

        results.querySelector(".rgsa-nav").appendChild(retake);

        return results;
    }

    function render() {
        clear(root);

        // Ako smo prošli sve korake => results
        if (current >= totalSteps) {
            root.appendChild(renderResults());
            return;
        }

        const step = steps[current];

        root.appendChild(renderProgress(current));

        if (step.type === "single") root.appendChild(renderSingle(step));
        else if (step.type === "multi") root.appendChild(renderMulti(step));
        else if (step.type === "optional") root.appendChild(renderOptional(step));

        const errorBox = el("div", { class: "rgsa-errors rgsa-hidden", role: "alert" });
        root.appendChild(errorBox);

        const nav = el("div", { class: "rgsa-nav" });

        const prev = el("button", { type: "button", class: "rgsa-button rgsa-button--secondary" });
        prev.textContent = "← Previous";
        prev.disabled = current === 0;
        prev.addEventListener("click", () => {
            errorBox.classList.add("rgsa-hidden");
            current = Math.max(0, current - 1);
            render();
            window.scrollTo({ top: document.querySelector("#rgsa-root").offsetTop - 20, behavior: "smooth" });
        });

        const next = el("button", { type: "button", class: "rgsa-button" });
        next.textContent = current === totalSteps - 1 ? "Finish →" : "Next →";
        next.addEventListener("click", () => {
            const v = validateStep(step);
            if (!v.ok) {
                errorBox.textContent = v.msg;
                errorBox.classList.remove("rgsa-hidden");
                return;
            }
            errorBox.classList.add("rgsa-hidden");

            // Optional step: može i skip (ako ništa nije izabrano, svejedno prolazi)
            current = current + 1;
            render();
            window.scrollTo({ top: document.querySelector("#rgsa-root").offsetTop - 20, behavior: "smooth" });
        });

        nav.appendChild(prev);
        nav.appendChild(next);
        root.appendChild(nav);
    }

    render();
})();
