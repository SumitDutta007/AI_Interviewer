import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowLeft,
  FiArrowRight,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiPlus,
  FiTrash2,
  FiArrowUpRight,
} from 'react-icons/fi'

const steps = [
  'Personal information',
  'Professional summary',
  'Skills',
  'Work experience',
  'Projects',
  'Education',
]

const emptyExperience = { company: '', role: '', duration: '', description: '' }
const emptyProject = { name: '', stack: '', github: '', description: '' }
const emptyEducation = { institution: '', degree: '', branch: '', cgpa: '', year: '' }

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  summary: '',
  skills: [''],
  experience: [],
  projects: [],
  education: [],
}

const isObjectFilled = (entry) => Object.values(entry).some((value) => value.trim())

const ResumeBuilder = () => {
  const [form, setForm] = useState(initialForm)
  const [step, setStep] = useState(0)
  const [preview, setPreview] = useState(false)

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const updateArrayItem = (field, index, value) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) => itemIndex === index ? value : item),
    }))
  }

  const addArrayItem = (field, item) => setForm((current) => ({ ...current, [field]: [...current[field], item] }))

  const removeArrayItem = (field, index) => {
    setForm((current) => ({ ...current, [field]: current[field].filter((_, itemIndex) => itemIndex !== index) }))
  }

  const addSkill = () => addArrayItem('skills', '')
  const updateSkill = (index, value) => updateArrayItem('skills', index, value)

  const canContinue = () => {
    if (step === 0) return Boolean(form.fullName.trim() && form.email.trim())
    if (step === 1) return Boolean(form.summary.trim())
    if (step === 2) return form.skills.some((skill) => skill.trim())
    return true
  }

  const nextStep = () => {
    if (!canContinue()) return
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  const previousStep = () => setStep((current) => Math.max(current - 1, 0))

  const downloadResume = () => window.print()

  if (preview) {
    return (
      <main className="resume-builder-page resume-builder-preview-page aura-shell">
        <header className="site-nav resume-builder-topbar resume-builder-preview-topbar no-print">
          <Link className="brand-mark" to="/dashboard" aria-label="Voxen dashboard">
            <span className="brand-mark__symbol">V</span>
            <span>voxen</span>
          </Link>
          <div className="nav-links">
            <Link to="/#method">How it works</Link>
            <Link to="/#signal">For candidates</Link>
            <Link to="/#about">About</Link>
          </div>
          <Link className="nav-login" to="/dashboard">Dashboard <FiArrowUpRight /></Link>
        </header>
        <div className="resume-builder-actions no-print">
          <button className="resume-builder-secondary-button" type="button" onClick={() => setPreview(false)}>
            <FiArrowLeft /> Back to edit
          </button>
          <button className="resume-builder-primary-button" type="button" onClick={downloadResume}>
            <FiDownload /> Download resume
          </button>
        </div>
        <article className="resume-document" aria-label="Resume preview">
          <header className="resume-document-header">
            <h1>{form.fullName || 'Your name'}</h1>
            <div className="resume-document-contact">
              {[form.phone, form.email, form.location].filter(Boolean).join('  |  ')}
              {(form.linkedin || form.github) && <span>{[form.linkedin, form.github].filter(Boolean).join('  |  ')}</span>}
            </div>
          </header>

          {form.summary && <ResumeSection title="SUMMARY"><p>{form.summary}</p></ResumeSection>}
          {form.skills.some((skill) => skill.trim()) && (
            <ResumeSection title="SKILLS">
              <p>{form.skills.filter((skill) => skill.trim()).join('  •  ')}</p>
            </ResumeSection>
          )}
          {form.experience.filter(isObjectFilled).length > 0 && (
            <ResumeSection title="EXPERIENCE">
              {form.experience.filter(isObjectFilled).map((experience, index) => (
                <ResumeEntry key={`experience-${index}`} title={`${experience.role}${experience.company ? ` | ${experience.company}` : ''}`} meta={experience.duration}>
                  <p>{experience.description}</p>
                </ResumeEntry>
              ))}
            </ResumeSection>
          )}
          {form.projects.filter(isObjectFilled).length > 0 && (
            <ResumeSection title="PROJECTS">
              {form.projects.filter(isObjectFilled).map((project, index) => (
                <ResumeEntry key={`project-${index}`} title={project.name} meta={project.github}>
                  {project.stack && <p><strong>Tech stack:</strong> {project.stack}</p>}
                  <p>{project.description}</p>
                </ResumeEntry>
              ))}
            </ResumeSection>
          )}
          {form.education.filter(isObjectFilled).length > 0 && (
            <ResumeSection title="EDUCATION">
              {form.education.filter(isObjectFilled).map((education, index) => (
                <ResumeEntry key={`education-${index}`} title={`${education.degree}${education.institution ? ` | ${education.institution}` : ''}`} meta={education.year}>
                  <p>{[education.branch, education.cgpa && `CGPA: ${education.cgpa}`].filter(Boolean).join('  |  ')}</p>
                </ResumeEntry>
              ))}
            </ResumeSection>
          )}
        </article>
      </main>
    )
  }

  return (
    <main className="resume-builder-page aura-shell">
      <header className="site-nav resume-builder-topbar">
        <Link className="brand-mark" to="/dashboard" aria-label="Voxen dashboard">
          <span className="brand-mark__symbol">V</span>
          <span>voxen</span>
        </Link>
        <div className="nav-links">
          <Link to="/#method">How it works</Link>
          <Link to="/#signal">For candidates</Link>
          <Link to="/#about">About</Link>
        </div>
        <Link className="nav-login" to="/dashboard">Dashboard <FiArrowUpRight /></Link>
      </header>
      <div className="resume-builder-shell">
        <div className="aura-caption aura-caption--top">Career document<br />in progress</div>
        <div className="aura-caption aura-caption--left">Resume builder / 01</div>
        <div className="aura-caption aura-caption--right">Voxen / 02</div>

        <div className="resume-builder-progress" aria-label={`Step ${step + 1} of ${steps.length}`}>
          <div className="resume-builder-progress-meta"><span>Step {step + 1} of {steps.length}</span><strong>{Math.round((step / (steps.length - 1)) * 100)}% complete</strong></div>
          <div className="resume-builder-progress-track"><span style={{ width: `${(step / (steps.length - 1)) * 100}%` }} /></div>
        </div>

        <section className="resume-builder-card">
          <div className="resume-builder-card-heading">
            <span>0{step + 1}</span>
            <div><h2>{steps[step]}</h2><p>{step === 0 ? 'Your basic contact details' : step === 1 ? 'A concise introduction to your experience' : 'Only add information you want to appear in your resume.'}</p></div>
          </div>
          <BuilderStep step={step} form={form} updateField={updateField} updateSkill={updateSkill} addSkill={addSkill} removeArrayItem={removeArrayItem} updateArrayItem={updateArrayItem} addArrayItem={addArrayItem} />
          <div className="resume-builder-navigation">
            <button className="resume-builder-secondary-button" type="button" onClick={previousStep} disabled={step === 0}><FiArrowLeft /> Back</button>
            {step === steps.length - 1
              ? <button className="resume-builder-primary-button" type="button" onClick={() => setPreview(true)}>Preview resume <FiArrowRight /></button>
              : <button className="resume-builder-primary-button" type="button" onClick={nextStep} disabled={!canContinue()}>Continue <FiArrowRight /></button>}
          </div>
        </section>
      </div>
    </main>
  )
}

const BuilderStep = ({ step, form, updateField, updateSkill, addSkill, removeArrayItem, updateArrayItem, addArrayItem }) => {
  if (step === 0) {
    return <div className="resume-builder-form-grid resume-builder-personal-step">
      <Field label="Full name" value={form.fullName} onChange={(value) => updateField('fullName', value)} required />
      <Field label="Email" type="email" value={form.email} onChange={(value) => updateField('email', value)} required />
      <Field label="Phone" value={form.phone} onChange={(value) => updateField('phone', value)} />
      <Field label="Location" value={form.location} onChange={(value) => updateField('location', value)} placeholder="City, State" />
      <Field label="LinkedIn URL" value={form.linkedin} onChange={(value) => updateField('linkedin', value)} icon={<FiLinkedin />} />
      <Field label="GitHub URL" value={form.github} onChange={(value) => updateField('github', value)} icon={<FiGithub />} />
    </div>
  }

  if (step === 1) {
    return <label className="resume-builder-field resume-builder-field--full"><span>Professional summary <b>*</b></span><textarea value={form.summary} onChange={(event) => updateField('summary', event.target.value)} placeholder="Backend developer with 2+ years of experience building scalable Node.js and MongoDB applications." rows="8" /></label>
  }

  if (step === 2) {
    return <div className="resume-builder-repeatable-list resume-builder-skills-step">
      {form.skills.map((skill, index) => <div className="resume-builder-inline-field" key={`skill-${index}`}><label className="resume-builder-field"><span>Skill {index + 1}</span><input style={{ width: `${Math.max(10, skill.length + 3)}ch` }} value={skill} onChange={(event) => updateSkill(index, event.target.value)} placeholder="Node.js" /></label>{form.skills.length > 1 && <button className="icon-button" type="button" onClick={() => removeArrayItem('skills', index)} aria-label={`Remove skill ${index + 1}`}><FiTrash2 /></button>}</div>)}
      <button className="resume-builder-add-button" type="button" onClick={addSkill}><FiPlus /> Add skill</button>
    </div>
  }

  const collection = step === 3 ? 'experience' : step === 4 ? 'projects' : 'education'
  const label = step === 3 ? 'experience' : step === 4 ? 'project' : 'education'
  const empty = step === 3 ? emptyExperience : step === 4 ? emptyProject : emptyEducation
  return <div className="resume-builder-repeatable-list">
    {form[collection].map((entry, index) => (
      <div className="resume-builder-repeatable-card" key={`${label}-${index}`}>
        <div className="resume-builder-repeatable-card-header"><strong>{label} {index + 1}</strong><button className="icon-button" type="button" onClick={() => removeArrayItem(collection, index)} aria-label={`Remove ${label} ${index + 1}`}><FiTrash2 /></button></div>
        <div className="resume-builder-form-grid">
          {step === 3 && <><Field label="Company" value={entry.company} onChange={(value) => updateArrayItem(collection, index, { ...entry, company: value })} /><Field label="Role" value={entry.role} onChange={(value) => updateArrayItem(collection, index, { ...entry, role: value })} /><Field label="Duration" value={entry.duration} onChange={(value) => updateArrayItem(collection, index, { ...entry, duration: value })} placeholder="Jan 2023 - Dec 2024" /><Field label="Description" className="resume-builder-field--full" value={entry.description} onChange={(value) => updateArrayItem(collection, index, { ...entry, description: value })} textarea /></>}
          {step === 4 && <><Field label="Project name" value={entry.name} onChange={(value) => updateArrayItem(collection, index, { ...entry, name: value })} /><Field label="Tech stack" value={entry.stack} onChange={(value) => updateArrayItem(collection, index, { ...entry, stack: value })} /><Field label="GitHub link" value={entry.github} onChange={(value) => updateArrayItem(collection, index, { ...entry, github: value })} /><Field label="Description" className="resume-builder-field--full" value={entry.description} onChange={(value) => updateArrayItem(collection, index, { ...entry, description: value })} textarea /></>}
          {step === 5 && <><Field label="College / University" value={entry.institution} onChange={(value) => updateArrayItem(collection, index, { ...entry, institution: value })} /><Field label="Degree" value={entry.degree} onChange={(value) => updateArrayItem(collection, index, { ...entry, degree: value })} /><Field label="Branch" value={entry.branch} onChange={(value) => updateArrayItem(collection, index, { ...entry, branch: value })} /><Field label="CGPA" value={entry.cgpa} onChange={(value) => updateArrayItem(collection, index, { ...entry, cgpa: value })} /><Field label="Year" value={entry.year} onChange={(value) => updateArrayItem(collection, index, { ...entry, year: value })} /></>}
        </div>
      </div>
    ))}
    <button className="resume-builder-add-button" type="button" onClick={() => addArrayItem(collection, { ...empty })}><FiPlus /> Add {label}</button>
  </div>
}

const Field = ({ label, value, onChange, type = 'text', placeholder, required = false, icon, className = '', textarea = false }) => (
  <label className={`resume-builder-field ${className}`}>
    <span>{icon}{label} {required && <b>*</b>}</span>
    {textarea ? <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows="4" /> : <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />}
  </label>
)

const ResumeSection = ({ title, children }) => <section className="resume-document-section"><h2>{title}</h2>{children}</section>
const ResumeEntry = ({ title, meta, children }) => <div className="resume-document-entry"><div><strong>{title}</strong>{meta && <span>{meta}</span>}</div>{children}</div>

export default ResumeBuilder
