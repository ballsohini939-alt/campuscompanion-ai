import { useEffect, useState } from 'react'
import './App.css'
import Auth from './Auth'
import { supabase } from './supabaseClient'


const scholarshipOpportunities = [
  {
    id: 'nsp',
    title: 'National Scholarship Portal',
    category: 'Scholarship',
    icon: '◇',
    description:
      'Explore government scholarship schemes through India’s National Scholarship Portal.',
    eligibility:
      'Eligibility, income limits, eligible courses, and deadlines depend on the individual scheme.',
    url: 'https://scholarships.gov.in/',
    tags: 'government central national student funding',
  },
  {
    id: 'svmcm',
    title: 'Swami Vivekananda Merit-cum-Means Scholarship',
    category: 'Scholarship',
    icon: '✳',
    description:
      'Explore West Bengal’s merit-cum-means scholarship programme.',
    eligibility:
      'Check the official portal for current academic, income, course, and application requirements.',
    url: 'https://svmcm.wbhed.gov.in/',
    tags: 'west bengal merit means svmcm education',
  },
  {
    id: 'oasis',
    title: 'OASIS Scholarship Portal',
    category: 'Scholarship',
    icon: '◇',
    description:
      'Visit West Bengal’s OASIS portal for relevant scholarship schemes.',
    eligibility:
      'Check the scheme-specific community, course, income, and application criteria.',
    url: 'https://oasis.gov.in/',
    tags: 'west bengal oasis sc st obc scholarship',
  },
  {
    id: 'wbmdfc',
    title: 'West Bengal Minority Scholarships',
    category: 'Scholarship',
    icon: '✳',
    description:
      'Explore scholarship information and application services from WBMDFC.',
    eligibility:
      'Check the official portal for current scheme requirements and application dates.',
    url: 'https://wbmdfcscholarship.in/',
    tags: 'west bengal minority wbmdfc scholarship',
  },
  {
    id: 'aicte',
    title: 'AICTE Student Development Schemes',
    category: 'Education',
    icon: '⌘',
    description:
      'Explore AICTE student-development schemes and education-support information.',
    eligibility:
      'Eligibility differs by scheme. Verify the current notice and application process.',
    url: 'https://www.aicte-india.org/',
    tags: 'aicte technical degree engineering girls education',
  },
]

function App() {
const [session, setSession] = useState(null)
const [authLoading, setAuthLoading] = useState(true)

const [activePage, setActivePage] = useState('Overview')

  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([])
const [completedTasks, setCompletedTasks] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('campuscompanion-completed-tasks') || '[]')
  } catch {
    return []
  }
})
  const [newTask, setNewTask] = useState('')
const [customTasks, setCustomTasks] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('campuscompanion-custom-tasks') || '[]')
  } catch {
    return []
  }
})

const [opportunitySearch, setOpportunitySearch] = useState('')
const [opportunityType, setOpportunityType] = useState('All')

const [savedOpportunities, setSavedOpportunities] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem('campuscompanion-saved-opportunities') || '[]'
    )
  } catch {
    return []
  }
})

  const navigation = [
    { name: 'Overview', icon: '⌂' },
    { name: 'AI Assistant', icon: '✳' },
    { name: 'Scholarships', icon: '◇' },
    { name: 'Study Planner', icon: '▦' },
    { name: 'Profile', icon: '◎' },
  ]

  const tasks = [
    {
      id: 1,
      title: 'Review scholarship deadlines',
      time: '10 minutes',
    },
    {
      id: 2,
      title: 'Practice DSA problems',
      time: '30 minutes',
    },
    {
      id: 3,
      title: 'Update your project portfolio',
      time: '20 minutes',
    },
  ]

useEffect(() => {
let mounted = true

const initializeAuth = async () => {
try {
const { data, error } = await supabase.auth.getSession();


if (!mounted) return;

if (error) {
  console.error('Unable to restore session:', error.message);
}

setSession(data?.session ?? null);


} catch (error) {
console.error('Unable to initialize authentication:', error);
if (mounted) setSession(null);
} finally {
if (mounted) setAuthLoading(false);
}
};


initializeAuth()

const {
data: { subscription },
} = supabase.auth.onAuthStateChange((_event, newSession) => {
setSession(newSession)
setAuthLoading(false)
})

return () => {
mounted = false
subscription.unsubscribe()
}
}, [])

useEffect(() => {
  localStorage.setItem(
    'campuscompanion-custom-tasks',
    JSON.stringify(customTasks)
  )
}, [customTasks])

useEffect(() => {
  localStorage.setItem(
    'campuscompanion-completed-tasks',
    JSON.stringify(completedTasks)
  )
}, [completedTasks])

useEffect(() => {
  localStorage.setItem(
    'campuscompanion-saved-opportunities',
    JSON.stringify(savedOpportunities)
  )
}, [savedOpportunities])

  function getAssistantReply(userMessage) {
  const text = userMessage.toLowerCase()

  if (
    text.includes('scholarship') ||
    text.includes('funding') ||
    text.includes('financial aid')
  ) {
    return {
      tool: 'scholarship_guidance',
      text:
        'SCHOLARSHIP GUIDANCE\n\n' +
        'Start by checking these details for each opportunity:\n' +
        '• Eligible course and year of study\n' +
        '• Family income requirements\n' +
        '• Academic eligibility\n' +
        '• Application deadline\n' +
        '• Required documents\n\n' +
        'You can investigate official scholarship portals and ' +
        'your college scholarship office. I do not have live ' +
        'scholarship listings connected yet, so verify current ' +
        'opportunities and deadlines with their official providers.',
    }
  }

  if (
    text.includes('study plan') ||
    text.includes('study schedule') ||
    text.includes('study routine')
  ) {
    return {
      tool: 'study_plan',
      text:
        'YOUR STARTER STUDY PLAN\n\n' +
        '1. 30 minutes — Learn one concept.\n' +
        '2. 30 minutes — Solve practice questions.\n' +
        '3. 20 minutes — Practice DSA or coding.\n' +
        '4. 10 minutes — Review mistakes.\n\n' +
        'Adjust the schedule to your classes and available time. ' +
        'Consistency matters more than studying for long hours.',
    }
  }

  if (
    text.includes('project') ||
    text.includes('coding idea') ||
    text.includes('build an app')
  ) {
    return {
      tool: 'project_ideas',
      text:
        'PROJECT IDEA: STUDENT OPPORTUNITY TRACKER\n\n' +
        'Build an app that lets students save scholarships, ' +
        'track application deadlines, and record application status.\n\n' +
        'Suggested stack:\n' +
        '• React for the interface\n' +
        '• Node.js and Express for a backend\n' +
        '• Local storage for an initial prototype\n\n' +
        'Start with saving opportunities and updating their status. ' +
        'Add a database only when the basic features work.',
    }
  }

  if (
    text.includes('internship') ||
    text.includes('career') ||
    text.includes('resume') ||
    text.includes('job')
  ) {
    return {
      tool: 'career_guidance',
      text:
        'YOUR INTERNSHIP PREPARATION PLAN\n\n' +
        '1. Build two or three projects you can demonstrate.\n' +
        '2. Keep your GitHub repositories organized with READMEs.\n' +
        '3. Prepare a concise, truthful resume.\n' +
        '4. Practice programming fundamentals and DSA.\n' +
        '5. Apply through legitimate company career pages ' +
        'and trusted internship platforms.\n\n' +
        'Never pay a recruiter to secure an internship.',
    }
  }

  return {
    tool: 'general_student_guidance',
    text:
      'I can currently help with four areas:\n\n' +
      '🎓 Scholarship guidance\n' +
      '📅 Study planning\n' +
      '💻 Coding project ideas\n' +
      '💼 Internship and career preparation\n\n' +
      'Try asking: "Help me find scholarships" or ' +
      '"Create a study plan".',
  }
}

function handleSendMessage(event) {
  event.preventDefault()

  const userMessage = message.trim()

  if (!userMessage) return

  const result = getAssistantReply(userMessage)

  setChatMessages((previous) => [
    ...previous,
    { role: 'user', text: userMessage },
    {
      role: 'assistant',
      text: result.text,
      tool: result.tool,
    },
  ])

  setActivePage('AI Assistant')
  setMessage('')
}

  function toggleTask(id) {
    setCompletedTasks((previous) =>
      previous.includes(id)
        ? previous.filter((taskId) => taskId !== id)
        : [...previous, id],
    )
  }

  function addTask(event) {
  event.preventDefault()

  const title = newTask.trim()

  if (!title) return

  const task = {
    id: Date.now(),
    title,
    time: 'Custom task',
  }

  setCustomTasks((previous) => [...previous, task])
  setNewTask('')
}

  function renderContent() {
    if (activePage === 'Profile') {
      const user = session?.user
      const fullName =
        user?.user_metadata?.full_name ||
        user?.email?.split('@')[0] ||
        'Student'

      return (
        <section className="content-panel profile-page">
         <div className="section-heading">
  <span className="eyebrow">YOUR PERSONAL SPACE</span>
  <p>
    Your account details and your CampusCompanion workspace, all in one place.
  </p>
</div>


          <div className="profile-hero-card">
            <div className="profile-large-avatar">
              {fullName.charAt(0).toUpperCase()}
            </div>

            <div className="profile-hero-info">
              <span className="eyebrow">STUDENT ACCOUNT</span>
              <h3>{fullName}</h3>
              <p>{user?.email || 'Email unavailable'}</p>
              <span className="profile-status">
                <span className="profile-status-dot" />
                Account signed in
              </span>
            </div>
          </div>

          
<div className="profile-details-grid">
  <article className="profile-detail-card">
    <span className="profile-detail-icon">✦</span>
    <span className="eyebrow">YOUR WORKSPACE</span>
    <h3>CampusCompanion AI</h3>
    <p>
      Your personal space for study planning, scholarships,
      and career preparation.
    </p>
  </article>

  <article className="profile-detail-card">
    <span className="profile-detail-icon">✓</span>
    <span className="eyebrow">ACCOUNT STATUS</span>
    <h3>You're all set</h3>
    <p>
      You're signed in and ready to continue your student journey.
    </p>
  </article>
</div>

          <div className="content-panel profile-security-card">
            <div>
              <span className="eyebrow">ACCOUNT SECURITY</span>
              <h3>Keep your account secure</h3>
              <p>
                Always sign out when using a shared or public computer.
              </p>
            </div>

            <button
              className="secondary-button"
              onClick={async () => {
                const { error } = await supabase.auth.signOut()

                if (error) {
                  alert('Unable to sign out. Please try again.')
                } else {
                  setSession(null)
                }
              }}
            >
              Sign out
            </button>
          </div>
        </section>
      )
    }


    if (activePage === 'AI Assistant') {
      return (
        <section className="content-panel assistant-panel">
          <div className="section-heading">
  <span className="eyebrow">YOUR PERSONAL SPACE</span>
  <p>
    Your account details and your CampusCompanion workspace, all in one place.
  </p>
</div>
          
                    {chatMessages.map((chat, index) => (
            <div
              className={`chat-message ${chat.role}`}
              key={`${chat.role}-${index}`}
            >
              <span className="chat-role">
                {chat.role === 'user' ? 'YOU' : 'CAMPUS COMPANION'}
              </span>

              <p style={{ whiteSpace: 'pre-wrap' }}>
                {chat.text}
              </p>

              {chat.tool && (
                <small>
                  Tool used: {chat.tool.replaceAll('_', ' ')}
                </small>
              )}
            </div>
          ))}


          <div className="assistant-welcome">
            <div className="assistant-avatar">✳</div>
            <div>
              <h3>Meet your Campus Companion</h3>
              <p>
                I can help you organize your goals and find the right
                next steps. Choose a suggestion below to get started.
              </p>
            </div>
          </div>

          <div className="suggestion-grid">
            <button onClick={() => setMessage('Help me find scholarships')}>
              <span>◇</span>
              <strong>Find scholarships</strong>
              <small>Explore funding opportunities</small>
            </button>

            <button onClick={() => setMessage('Create a study plan')}>
              <span>▦</span>
              <strong>Plan my studies</strong>
              <small>Build a manageable routine</small>
            </button>

            <button onClick={() => setMessage('Help me prepare for internships')}>
              <span>↗</span>
              <strong>Career preparation</strong>
              <small>Work toward your career goals</small>
            </button>

            <button onClick={() => setMessage('Suggest a coding project')}>
              <span>⌘</span>
              <strong>Project ideas</strong>
              <small>Turn skills into projects</small>
            </button>
          </div>

          <form className="chat-form" onSubmit={handleSendMessage}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask your Campus Companion..."
              aria-label="Message your Campus Companion"
            />
            <button type="submit" aria-label="Send message">
              →
            </button>
          </form>

          <p className="disclaimer">
            Suggestions are informational. Verify eligibility and deadlines
            with official providers.
          </p>
        </section>
      )
    }

 if (activePage === 'Scholarships') {
  const filteredOpportunities = scholarshipOpportunities.filter(
    (opportunity) => {
      const searchText = opportunitySearch.toLowerCase()

      const matchesSearch = [
        opportunity.title,
        opportunity.description,
        opportunity.category,
        opportunity.tags,
      ]
        .join(' ')
        .toLowerCase()
        .includes(searchText)

      const matchesType =
        opportunityType === 'All' ||
        opportunity.category === opportunityType

      return matchesSearch && matchesType
    }
  )

  return (
    <section className="content-panel">
      <span className="eyebrow">FUND YOUR EDUCATION</span>

      <h2>Scholarship opportunities</h2>

      <p className="section-description">
        Discover official education-support portals, explore opportunities,
        and keep track of the options you want to investigate.
      </p>

      <div className="opportunity-controls">
        <input
          type="search"
          className="opportunity-search"
          placeholder="Search scholarships, AICTE, West Bengal..."
          value={opportunitySearch}
          onChange={(event) =>
            setOpportunitySearch(event.target.value)
          }
          aria-label="Search scholarship opportunities"
        />

        <div className="opportunity-filters">
          {['All', 'Scholarship', 'Education'].map((type) => (
            <button
              key={type}
              type="button"
              className={
                opportunityType === type
                  ? 'opportunity-filter active'
                  : 'opportunity-filter'
              }
              onClick={() => setOpportunityType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="opportunity-results-header">
        <span className="eyebrow">
          DISCOVERY HUB · {filteredOpportunities.length} RESULTS
        </span>

        <span className="saved-count">
          {savedOpportunities.length} saved
        </span>
      </div>

      <div className="opportunity-grid">
        {filteredOpportunities.map((opportunity) => {
          const isSaved = savedOpportunities.includes(opportunity.id)

          return (
            <article className="opportunity-card" key={opportunity.id}>
              <div className="opportunity-card-top">
                <span className="opportunity-icon">
                  {opportunity.icon}
                </span>

                <span className="opportunity-category">
                  {opportunity.category}
                </span>
              </div>

              <h3>{opportunity.title}</h3>

              <p>{opportunity.description}</p>

              <div className="eligibility-note">
                <strong>Eligibility check</strong>
                <p>{opportunity.eligibility}</p>
              </div>

              <div className="opportunity-actions">
                <a
                  className="secondary-button"
                  href={opportunity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official portal ↗
                </a>

                <button
                  type="button"
                  className={
                    isSaved
                      ? 'save-opportunity saved'
                      : 'save-opportunity'
                  }
                  onClick={() => {
                    alert('Save button clicked!')
                    setSavedOpportunities((previous) =>
                      isSaved
                        ? previous.filter(
                            (id) => id !== opportunity.id
                          )
                        : [...previous, opportunity.id]
                    )
                  }}
                  aria-pressed={isSaved}
                >
                  {isSaved ? '✓ Saved' : '+ Save'}
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="opportunity-empty">
          <h3>No matching opportunities</h3>
          <p>Try another keyword or select a different category.</p>

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setOpportunitySearch('')
              setOpportunityType('All')
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      <p className="opportunity-disclaimer">
        These listings link to official discovery portals. This prototype
        does not verify live availability, deadlines, or personal eligibility.
        Confirm all requirements with the official provider before applying.
      </p>
    </section>
  )
}

    if (activePage === 'Study Planner') {
      return (
        <section className="content-panel">
          <span className="eyebrow">SMALL STEPS, BIG PROGRESS</span>
          <h2>Your study planner</h2>
          <p className="section-description">
            Check off your tasks as you complete them.
          </p>
          

          <form className="chat-form task-form" onSubmit={addTask}>
  <input
    type="text"
    value={newTask}
    onChange={(event) => setNewTask(event.target.value)}
    placeholder="Add a new study task..."
    aria-label="New study task"
  />

  <button type="submit" aria-label="Add task">
    +
  </button>
</form>

          <div className="task-list">
{[...tasks, ...customTasks].map((task) => (
              <label className="task-item" key={task.id}>
                <input
                  type="checkbox"
                  checked={completedTasks.includes(task.id)}
                  onChange={() => toggleTask(task.id)}
                />
                <span className={completedTasks.includes(task.id) ? 'task-done' : ''}>
                  <strong>{task.title}</strong>
                  <small>{task.time}</small>
                </span>
              </label>
            ))}
          </div>

          <p className="progress-note">
{completedTasks.length} of {tasks.length + customTasks.length} tasks completed          </p>
        </section>
      )
    }

    return (
      <>
        <section className="welcome-banner">
          <div className="welcome-copy">
            <span className="eyebrow">YOUR FUTURE, WITH A PLAN</span>
            <h2>
              Make your next move
              <br />
              <span>your best one.</span>
            </h2>
            <p>
              Your personal space for scholarships, learning, and
              building a career you believe in.
            </p>
            <button
              className="primary-button"
              onClick={() => setActivePage('AI Assistant')}
            >
              Meet your AI companion <span>→</span>
            </button>
          </div>

          <div className="orb-container" aria-hidden="true">
            <div className="orb-ring ring-one" />
            <div className="orb-ring ring-two" />
            <div className="orb">
              <span>✳</span>
            </div>
            <span className="floating-dot dot-one" />
            <span className="floating-dot dot-two" />
          </div>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <span className="stat-icon purple">◇</span>
            <span className="stat-label">Opportunities</span>
            <strong>Discover</strong>
            <small>Find options that fit your goals</small>
          </article>

          <article className="stat-card">
            <span className="stat-icon pink">✳</span>
            <span className="stat-label">AI Companion</span>
            <strong>One step ahead</strong>
            <small>Get help planning your next move</small>
          </article>

          <article className="stat-card">
            <span className="stat-icon blue">▦</span>
            <span className="stat-label">Daily Progress</span>
            <strong>{completedTasks.length}/{tasks.length + customTasks.length} tasks</strong>
            <small>Build momentum, one task at a time</small>
          </article>
        </section>

        <section className="dashboard-grid">
          <div className="content-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">YOUR DAILY FOCUS</span>
                <h3>Today's priorities</h3>
              </div>
              <button
                className="text-button"
                onClick={() => setActivePage('Study Planner')}
              >
                View all →
              </button>
            </div>

            <div className="task-list">
              {tasks.map((task) => (
                <label className="task-item" key={task.id}>
                  <input
                    type="checkbox"
                    checked={completedTasks.includes(task.id)}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span className={completedTasks.includes(task.id) ? 'task-done' : ''}>
                    <strong>{task.title}</strong>
                    <small>{task.time}</small>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="content-panel quick-panel">
            <span className="eyebrow">QUICK START</span>
            <h3>Where would you like to begin?</h3>
            <button onClick={() => setActivePage('Scholarships')}>
              <span>◇</span>
              <div>
                <strong>Explore scholarships</strong>
                <small>Find education funding</small>
              </div>
              <span>→</span>
            </button>

            <button onClick={() => setActivePage('AI Assistant')}>
              <span>✳</span>
              <div>
                <strong>Ask your companion</strong>
                <small>Get help with your goals</small>
              </div>
              <span>→</span>
            </button>

            <button onClick={() => setActivePage('Study Planner')}>
              <span>▦</span>
              <div>
                <strong>Plan your day</strong>
                <small>Organize your priorities</small>
              </div>
              <span>→</span>
            </button>
          </div>
        </section>
      </>
    )
  }

if (authLoading) {
return (
   <div className="auth-loading"> 
   <p>Preparing your CampusCompanion workspace...</p> 
   </div>
)
}

if (!session) {
return <Auth onAuthenticated={(newSession) => setSession(newSession)} />
}

return (
   <div className="app-shell">

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S<span>✳</span></div>
          <div>
            <h1>Campus<span>Companion</span></h1>
            <small>YOUR STUDENT SPACE</small>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map((item) => (
            <button
              key={item.name}
              className={activePage === item.name ? 'nav-item active' : 'nav-item'}
              onClick={() => setActivePage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
              {activePage === item.name && <span className="active-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span>✦</span>
            <p>Your future is built one small step at a time.</p>
          </div>

          
<button
  type="button"
  className="profile-mini"
  onClick={() => setActivePage('Profile')}
  aria-label="Open your profile"
>
  <div className="profile-avatar">
    {(
      session?.user?.user_metadata?.full_name ||
      session?.user?.email?.split('@')[0] ||
      'S'
    )
      .charAt(0)
      .toUpperCase()}
  </div>

  <div>
    <strong>
      {session?.user?.user_metadata?.full_name ||
        session?.user?.email?.split('@')[0] ||
        'Student'}
    </strong>
    <small>View your profile</small>
  </div>

  <span className="profile-menu">→</span>
</button>


        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>{activePage}</strong>
          </div>
          <div className="topbar-right">
  <span className="status-dot" />
  <span>YOUR JOURNEY STARTS HERE</span>

  <div className="topbar-avatar">
    {(
  session?.user?.user_metadata?.full_name ||
  session?.user?.email ||
  'S'
).charAt(0).toUpperCase()}
  </div>

<button
type="button"
className="sign-out-button"
onClick={async () => {
const { error } = await supabase.auth.signOut()


  if (error) {
    console.error('Sign out failed:', error.message)
  }
}}


>


Sign Out


  </button>
</div>

        </header>

        <div className="page-content">
          <div className="page-heading">
            <div>
              <span className="eyebrow">WELCOME TO YOUR SPACE</span>
              <h2>
                {activePage === 'Overview'
  ? `Hello, ${session?.user?.user_metadata?.full_name ||
      session?.user?.email?.split('@')[0] ||
      'Student'}`

  : activePage}
                <span className="heading-sparkle"> ✳</span>
              </h2>
              <p>
                {activePage === 'Overview'
                  ? "A little progress every day adds up to something extraordinary."
                  : 'Your goals, opportunities, and next steps — all in one place.'}
              </p>
            </div>
            <div className="date-badge">✦ &nbsp; YOUR NEXT CHAPTER</div>
          </div>

          {renderContent()}

          <footer className="app-footer">
            <span>CampusCompanion AI</span>
            <span>Built for students. Designed for possibilities.</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App