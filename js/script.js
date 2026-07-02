/* =========================================================
   HORIZON INSTITUTE — shared site behaviour
   ========================================================= */

/* ---------------------------------------------------------
   EmailJS configuration
   Replace these three values with your client's real EmailJS
   credentials (see README.md → "Connect EmailJS" for steps).
   --------------------------------------------------------- */
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

document.addEventListener("DOMContentLoaded", () => {
  /* Init EmailJS once the SDK (loaded via CDN in each page) is available */
  if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  initMobileNav();
  initEnquiryForms();
  initCounters();
  initCourseFilter();
  document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());
});

/* ---------------- Mobile nav toggle ---------------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav__toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
    const expanded = nav.classList.contains("is-open");
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  });
}

/* ---------------- Enquiry / contact forms ---------------- */
function initEnquiryForms() {
  const forms = document.querySelectorAll("form[data-enquiry-form]");
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => handleFormSubmit(e, form));
  });
}

function handleFormSubmit(e, form) {
  e.preventDefault();

  const statusEl = form.querySelector("[data-form-status]");
  const submitBtn = form.querySelector("[data-submit-btn]");

  if (!validateForm(form)) {
    showStatus(statusEl, "Please fix the highlighted fields and try again.", "error");
    return;
  }

  const data = {
    name: form.querySelector("[name='name']")?.value.trim(),
    phone: form.querySelector("[name='phone']")?.value.trim(),
    email: form.querySelector("[name='email']")?.value.trim(),
    course: form.querySelector("[name='course']")?.value,
    message: form.querySelector("[name='message']")?.value.trim() || "—",
    page: window.location.pathname,
  };

  if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
    /* EmailJS not connected yet — let the developer know instead of failing silently */
    console.warn("EmailJS is not configured yet. Add your Public Key, Service ID and Template ID in js/script.js");
    showStatus(
      statusEl,
      "Form looks good! (EmailJS isn't connected yet — add your credentials in js/script.js to start receiving real enquiries.)",
      "success"
    );
    form.reset();
    return;
  }

  setLoading(submitBtn, true);

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, data).then(
    () => {
      setLoading(submitBtn, false);
      showStatus(statusEl, "Thank you! Your enquiry has been received — our team will contact you within 24 hours.", "success");
      form.reset();
    },
    (error) => {
      setLoading(submitBtn, false);
      console.error("EmailJS error:", error);
      showStatus(statusEl, "Something went wrong while sending your enquiry. Please call us directly or try again.", "error");
    }
  );
}

function validateForm(form) {
  let isValid = true;

  const name = form.querySelector("[name='name']");
  if (name && name.value.trim().length < 2) {
    setFieldError(name, "Please enter your full name.");
    isValid = false;
  } else if (name) setFieldError(name, "");

  const phone = form.querySelector("[name='phone']");
  if (phone && !/^\d{10}$/.test(phone.value.trim())) {
    setFieldError(phone, "Enter a valid 10-digit mobile number.");
    isValid = false;
  } else if (phone) setFieldError(phone, "");

  const email = form.querySelector("[name='email']");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    setFieldError(email, "Enter a valid email address.");
    isValid = false;
  } else if (email) setFieldError(email, "");

  const course = form.querySelector("[name='course']");
  if (course && !course.value) {
    setFieldError(course, "Please select a course.");
    isValid = false;
  } else if (course) setFieldError(course, "");

  return isValid;
}

function setFieldError(field, message) {
  const wrapper = field.closest(".form-field");
  if (!wrapper) return;
  const errorEl = wrapper.querySelector(".field-error");
  if (errorEl) errorEl.textContent = message;
  field.style.borderColor = message ? "var(--maroon)" : "";
}

function showStatus(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.classList.remove("is-success", "is-error");
  el.classList.add(type === "success" ? "is-success" : "is-error");
}

function setLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? "Sending…" : btn.dataset.defaultLabel || "Send Enquiry";
  if (!btn.dataset.defaultLabel) btn.dataset.defaultLabel = btn.textContent;
}

/* ---------------- Animated stat counters ---------------- */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10) || 0;
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString() + (el.dataset.suffix || "");
  }
  requestAnimationFrame(tick);
}

/* ---------------- Course category filter (courses.html) ---------------- */
function initCourseFilter() {
  const tabs = document.querySelectorAll("[data-filter-tab]");
  const groups = document.querySelectorAll("[data-course-group]");
  if (!tabs.length || !groups.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      const filter = tab.dataset.filterTab;

      groups.forEach((group) => {
        const match = filter === "all" || group.dataset.courseGroup === filter;
        group.style.display = match ? "" : "none";
      });
    });
  });
}
