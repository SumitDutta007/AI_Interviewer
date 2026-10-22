import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiCheckCircle, FiFileText, FiMail, FiPhone, FiTarget, FiUploadCloud, FiUser, FiX } from 'react-icons/fi'
import api from '../utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setResume } from '../redux/resumeSlice'

const toArray = (value) => {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

const formatObjectLines = (value) => Object.entries(value)
  .filter(([, fieldValue]) => fieldValue !== null && fieldValue !== undefined && fieldValue !== '')
  .map(([key, fieldValue]) => `${key}: ${Array.isArray(fieldValue) ? fieldValue.join(', ') : fieldValue}`)

const getScoreTone = (value) => {
  if (value === null) return 'unknown'
  if (value >= 80) return 'excellent'
  if (value >= 60) return 'good'
  if (value >= 40) return 'average'
  return 'needs-work'
}

const ResumeScorer = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const dispatch = useDispatch()
  const {resume} = useSelector((state) => state.resume)
  const hasAnalysis = Boolean(resume)

  const score = Number.isFinite(Number(resume?.score)) ? Math.max(0, Math.min(100, Number(resume.score))) : null
  const scoreTone = getScoreTone(score)
  const scoreCircumference = 326.73
  const scoreOffset = score === null ? scoreCircumference : scoreCircumference - (score / 100) * scoreCircumference
  const skills = toArray(resume?.skills ?? resume?.skill)
  const educationItems = toArray(resume?.education)
  const projectItems = toArray(resume?.projects)
  const experienceItems = toArray(resume?.experience)
  const strengths = toArray(resume?.strengths)
  const weaknesses = toArray(resume?.weaknesses)
  const missingSkills = toArray(resume?.missingSkills)
  const recommendations = toArray(resume?.recommendations)

  const selectFile = (file) => {
    setError('')
    setIsComplete(false)

    if (!file) return
    if (file.type !== 'application/pdf') {
      setSelectedFile(null)
      setError('Please upload a PDF file.')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setSelectedFile(null)
      setError('Your resume must be smaller than 20 MB.')
      return
    }

    setSelectedFile(file)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    selectFile(event.dataTransfer.files[0])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedFile || isUploading) return

    setIsUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('resume', selectedFile)
      const response = await api.post('/api/resume/upload', formData)
      console.log('[resume] Resume data:', response.data)

      dispatch(setResume(response?.data?.data))

      setIsComplete(true)
    } catch (uploadError) {
      console.error('[resume] Upload failed:', uploadError)
      setError(uploadError.response?.data?.message || 'We could not analyze your resume. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="resume-scorer-page">
      <div className="resume-scorer-backdrop" />
      <section className={`resume-upload-modal${hasAnalysis ? ' has-analysis' : ''}`} aria-labelledby="resume-scorer-title">
        <button className="resume-upload-close" type="button" onClick={() => navigate('/dashboard')} aria-label="Close resume scorer">
          <FiX />
        </button>
        <div className="resume-upload-header">
          <span className="resume-upload-kicker">Resume scorer</span>
          <h1 id="resume-scorer-title">{hasAnalysis ? 'Resume analysis' : <>See how your resume <em>holds up.</em></>}</h1>
          <p>{hasAnalysis ? 'Your latest resume, scored and translated into clear next steps.' : 'Upload your latest resume and we’ll analyze it against the roles you’re preparing for.'}</p>
        </div>

        <form className="resume-upload-form" onSubmit={handleSubmit}>
          <button
            className={`resume-dropzone${isDragging ? ' is-dragging' : ''}${selectedFile ? ' has-file' : ''}`}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => selectFile(event.target.files[0])}
              hidden
            />
            {selectedFile ? (
              <>
                <span className="resume-file-icon"><FiFileText /></span>
                <strong>{selectedFile.name}</strong>
                <small>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB · PDF selected</small>
                <span className="resume-dropzone-link">Choose a different file</span>
              </>
            ) : (
              <>
                <span className="resume-upload-icon"><FiUploadCloud /></span>
                <strong>Drop your resume here</strong>
                <small>or <span className="resume-dropzone-link">browse from your device</span></small>
                <span className="resume-file-note">PDF only · up to 20 MB</span>
              </>
            )}
          </button>

          {error && <p className="resume-upload-error" role="alert">{error}</p>}
          {isComplete && <p className="resume-upload-success" role="status"><FiCheckCircle /> Resume analyzed successfully.</p>}

          <button className="resume-analyze-button" type="submit" disabled={!selectedFile || isUploading}>
            {isUploading && <span className="resume-button-spinner" aria-hidden="true" />}
            {isUploading ? 'Analyzing resume...' : isComplete ? 'Analyze another resume' : 'Analyze resume'}
          </button>
        </form>

        {hasAnalysis && (
          <section className="resume-analysis" aria-label="Resume analysis results">
            <header className="resume-analysis-header resume-analysis-section resume-analysis-score-section">
              <div>
                <span className="resume-analysis-kicker">Analysis report</span>
                <h2>Your resume at a glance</h2>
                <p>{resume?.summary || 'Your report is ready. Review your strengths and focus areas below.'}</p>
              </div>
              <div className={`resume-score-card resume-score-card--${scoreTone}`} style={{ '--score-offset': scoreOffset }}>
                <div className="resume-score-ring">
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle className="resume-score-ring__track" cx="60" cy="60" r="52" />
                    <circle className="resume-score-ring__progress" cx="60" cy="60" r="52" />
                  </svg>
                  <div><strong>{score ?? '--'}</strong><small>/100</small></div>
                </div>
                <span><FiTarget /> ATS score</span>
                <p>{resume?.suggestedRole || 'Suggested role unavailable'}</p>
                <b className="resume-score-status">
                  {scoreTone === 'excellent' && 'Excellent match'}
                  {scoreTone === 'good' && 'Good foundation'}
                  {scoreTone === 'average' && 'Room to improve'}
                  {scoreTone === 'needs-work' && 'Needs attention'}
                  {scoreTone === 'unknown' && 'Score unavailable'}
                </b>
              </div>
            </header>

            <div className="resume-grid resume-major-grid">
              <article className="resume-analysis-panel resume-major-section resume-major-section--strengths">
                <span className="resume-section-number">01</span>
                <h3>Strengths</h3>
                <div className="resume-tag-list">
                  {strengths.length ? strengths.map((item, index) => <span key={`strength-${index}`}>{String(item)}</span>) : <p>No strengths found.</p>}
                </div>
              </article>

              <article className="resume-analysis-panel resume-major-section resume-major-section--weaknesses">
                <span className="resume-section-number">02</span>
                <h3>Weaknesses</h3>
                <div className="resume-tag-list weakness">
                  {weaknesses.length ? weaknesses.map((item, index) => <span key={`weakness-${index}`}>{String(item)}</span>) : <p>No weaknesses found.</p>}
                </div>
              </article>
            </div>

            <div className="resume-grid resume-major-grid resume-major-grid--lower">
              <article className="resume-analysis-panel resume-major-section resume-major-section--missing">
                <span className="resume-section-number">03</span>
                <h3>Missing skills</h3>
                <div className="resume-tag-list warning">
                  {missingSkills.length ? missingSkills.map((item, index) => <span key={`missing-${index}`}>{String(item)}</span>) : <p>No missing skills detected.</p>}
                </div>
              </article>

              <article className="resume-analysis-panel resume-major-section resume-major-section--recommendations">
                <span className="resume-section-number">04</span>
                <h3>Recommendations</h3>
                <ol className="resume-recommendations">
                  {recommendations.length ? recommendations.map((item, index) => <li key={`recommendation-${index}`}>{String(item)}</li>) : <li>No recommendations available.</li>}
                </ol>
              </article>
            </div>

            <details className="resume-supporting-details">
              <summary>View extracted resume details</summary>
              <div className="resume-details-content">
                <div className="resume-grid">
                  <article className="resume-analysis-panel">
                    <h3><FiUser /> Profile</h3>
                    <ul className="resume-contact-list">
                      <li><strong>Name</strong><span>{resume?.name || 'Not available'}</span></li>
                      <li><strong><FiMail /> Email</strong><span>{resume?.email || 'Not available'}</span></li>
                      <li><strong><FiPhone /> Phone</strong><span>{resume?.phone || 'Not available'}</span></li>
                    </ul>
                    <p className="resume-summary-text">{resume?.summary || 'Summary unavailable for this upload.'}</p>
                  </article>
                  <article className="resume-analysis-panel">
                    <h3>Skills</h3>
                    <div className="resume-tag-list">
                      {skills.length ? skills.map((item, index) => <span key={`${item}-${index}`}>{String(item)}</span>) : <p>No skills found.</p>}
                    </div>
                  </article>
                </div>
                <div className="resume-grid">
                  <article className="resume-analysis-panel">
                    <h3>Education</h3>
                    <ul className="resume-list">
                      {educationItems.length ? educationItems.map((entry, index) => (
                        <li key={`education-${index}`}>
                          {typeof entry === 'string' ? <p>{entry}</p> : <div><strong>{entry?.degree || entry?.institution || `Education #${index + 1}`}</strong>{formatObjectLines(entry).map((line) => <p key={line}>{line}</p>)}</div>}
                        </li>
                      )) : <li><p>No education data found.</p></li>}
                    </ul>
                  </article>
                  <article className="resume-analysis-panel">
                    <h3>Projects</h3>
                    <ul className="resume-list">
                      {projectItems.length ? projectItems.map((entry, index) => (
                        <li key={`project-${index}`}>
                          {typeof entry === 'string' ? <p>{entry}</p> : <div><strong>{entry?.name || `Project #${index + 1}`}</strong>{formatObjectLines(entry).map((line) => <p key={line}>{line}</p>)}</div>}
                        </li>
                      )) : <li><p>No projects found.</p></li>}
                    </ul>
                  </article>
                </div>
                <article className="resume-analysis-panel">
                  <h3>Experience</h3>
                  <ul className="resume-list">
                    {experienceItems.length ? experienceItems.map((entry, index) => (
                      <li key={`experience-${index}`}>
                        {typeof entry === 'string' ? <p>{entry}</p> : <div><strong>{entry?.role || entry?.company || `Experience #${index + 1}`}</strong>{formatObjectLines(entry).map((line) => <p key={line}>{line}</p>)}</div>}
                      </li>
                    )) : <li><p>No experience data found.</p></li>}
                  </ul>
                </article>
              </div>
            </details>
          </section>
        )}

        <button className="resume-upload-back" type="button" onClick={() => navigate('/dashboard')}>
          <FiArrowLeft /> Back to dashboard
        </button>
      </section>
    </main>
  )
}

export default ResumeScorer
