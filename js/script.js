
const WEB3FORMS_KEY = "b0e2f0d6-01f8-41af-b2b3-f4d395411c33";
const COLLEGE_EMAIL = "info@anjaneyacollege.com";

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initEnquiryForms();
  initCounters();
  initCourseFilter();
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
});

/* ---------------- Mobile nav toggle ---------------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav__toggle");
  const nav    = document.querySelector(".nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target)) nav.classList.remove("is-open");
  });
}

/* ---------------- Enquiry / contact forms ---------------- */
function initEnquiryForms() {
  document.querySelectorAll("form[data-enquiry-form]").forEach((form) => {
    form.addEventListener("submit", (e) => handleFormSubmit(e, form));
  });
}

async function handleFormSubmit(e, form) {
  e.preventDefault();

  const statusEl  = form.querySelector("[data-form-status]");
  const submitBtn = form.querySelector("[data-submit-btn]");

  if (!validateForm(form)) {
    showStatus(statusEl, "Please fix the highlighted fields and try again.", "error");
    return;
  }

  const data = {
    name        : form.querySelector("[name='name']")?.value.trim()      || "",
    phone       : form.querySelector("[name='phone']")?.value.trim()     || "",
    email       : form.querySelector("[name='email']")?.value.trim()     || "",
    course      : form.querySelector("[name='course']")?.value           || "",
    state       : form.querySelector("[name='state']")?.value            || "",
    qualification: form.querySelector("[name='qualification']")?.value   || "",
    message     : form.querySelector("[name='message']")?.value.trim()   || "—",
    page        : window.location.href,
  };

  setLoading(submitBtn, true);

  /* ── If Web3Forms key not yet set, show mailto fallback ── */
  if (!WEB3FORMS_KEY || WEB3FORMS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY") {
    // Compose a mailto link as fallback so enquiries still reach the college
    const subject = encodeURIComponent(`Admission Enquiry — ${data.course}`);
    const body    = encodeURIComponent(
      `Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\n` +
      `Course: ${data.course}\nState: ${data.state}\n` +
      `Qualification: ${data.qualification}\nMessage: ${data.message}`
    );
    setLoading(submitBtn, false);
    showStatus(
      statusEl,
      `Thank you, ${data.name}! Click the button below to send your enquiry via email.`,
      "success"
    );
    // Open mailto after short delay
    setTimeout(() => {
      window.location.href = `mailto:${COLLEGE_EMAIL}?subject=${subject}&body=${body}`;
    }, 600);
    return;
  }

  /* ── Web3Forms submission ── */
  try {
    const payload = {
      access_key       : WEB3FORMS_KEY,
      subject          : `New Admission Enquiry — ${data.course} | Anjaneya College`,
      from_name        : "Anjaneya College Website",
      name             : data.name,
      phone            : data.phone,
      email            : data.email,
      course_interested: data.course,
      state            : data.state,
      qualification    : data.qualification,
      message          : data.message,
      page_url         : data.page,
      botcheck         : "",   // honeypot
    };

    const res  = await fetch("https://api.web3forms.com/submit", {
      method : "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body   : JSON.stringify(payload),
    });
    const json = await res.json();

    if (json.success) {
      setLoading(submitBtn, false);
      showStatus(
        statusEl,
        `Thank you, ${data.name}! Your enquiry has been received — our team will call you within 24 hours.`,
        "success"
      );
      form.reset();
    } else {
      throw new Error(json.message || "Submission failed");
    }
  } catch (err) {
    console.error("Web3Forms error:", err);
    setLoading(submitBtn, false);
    showStatus(
      statusEl,
      "Something went wrong. Please call us directly at +91 81307 38419 or WhatsApp us.",
      "error"
    );
  }
}

/* ── Validation ── */
function validateForm(form) {
  let valid = true;

  const name = form.querySelector("[name='name']");
  if (name && name.value.trim().length < 2) {
    setFieldError(name, "Please enter your full name."); valid = false;
  } else if (name) setFieldError(name, "");

  const phone = form.querySelector("[name='phone']");
  if (phone && !/^\d{10}$/.test(phone.value.trim())) {
    setFieldError(phone, "Enter a valid 10-digit mobile number."); valid = false;
  } else if (phone) setFieldError(phone, "");

  const email = form.querySelector("[name='email']");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    setFieldError(email, "Enter a valid email address."); valid = false;
  } else if (email) setFieldError(email, "");

  const course = form.querySelector("[name='course']");
  if (course && !course.value) {
    setFieldError(course, "Please select a course."); valid = false;
  } else if (course) setFieldError(course, "");

  return valid;
}

function setFieldError(field, msg) {
  const wrap = field.closest(".form-field");
  if (!wrap) return;
  const err = wrap.querySelector(".field-error");
  if (err) err.textContent = msg;
  field.style.borderColor = msg ? "var(--maroon)" : "";
}

function showStatus(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.className = "form-status " + (type === "success" ? "is-success" : "is-error");
}

function setLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn.dataset.defaultLabel = btn.dataset.defaultLabel || btn.textContent;
    btn.textContent = "Sending…";
  } else {
    btn.textContent = btn.dataset.defaultLabel || "Send Enquiry";
  }
}

/* ---------------- Animated stat counters ---------------- */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); observer.unobserve(e.target); } }),
    { threshold: 0.4 }
  );
  counters.forEach((c) => observer.observe(c));
}

function animateCount(el) {
  const target   = parseInt(el.dataset.count, 10) || 0;
  const suffix   = el.dataset.suffix || "";
  const duration = 1400;
  const start    = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString() + suffix;
  }
  requestAnimationFrame(tick);
}

/* ---------------- Course category filter ---------------- */
function initCourseFilter() {
  const tabs   = document.querySelectorAll("[data-filter-tab]");
  const groups = document.querySelectorAll("[data-course-group]");
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => { t.classList.remove("is-active"); t.setAttribute("aria-selected","false"); });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected","true");
      const filter = tab.dataset.filterTab;
      groups.forEach((g) => { g.style.display = (filter === "all" || g.dataset.courseGroup === filter) ? "" : "none"; });
    });
  });
}
