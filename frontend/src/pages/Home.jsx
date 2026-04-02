import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import { useAuth } from '../context/AuthContext'
import { FiBookOpen, FiShield, FiTrendingUp, FiArrowRight, FiStar } from 'react-icons/fi'

const features = [
  { icon: FiBookOpen,   title: 'Expert Courses',       desc: 'Learn from industry professionals with real-world project experience.' },
  { icon: FiShield,     title: 'Secure Payments',      desc: 'All transactions protected by Stripe — industry-leading security.' },
  { icon: FiTrendingUp, title: 'Track Progress',        desc: 'Monitor your learning journey and purchased courses in one place.' },
]

const stats = [
  { value: '50+',  label: 'Courses Available' },
  { value: '5K+',  label: 'Students Enrolled' },
  { value: '4.9',  label: 'Average Rating'    },
  { value: '24/7', label: 'Support'           },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #042C53 0%, #0C447C 50%, #185FA5 100%)',
        padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* Background circles */}
        {[
          { w:400, h:400, t:-100, r:-100, o:0.05 },
          { w:300, h:300, b:-80,  l:-80,  o:0.05 },
        ].map((c,i) => (
          <div key={i} style={{
            position:'absolute', width:c.w, height:c.h, borderRadius:'50%',
            background:'white', top:c.t, right:c.r, bottom:c.b, left:c.l, opacity:c.o
          }}/>
        ))}

        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 99, padding: '6px 16px', marginBottom: 24,
            fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 600
          }}>
            <FiStar size={13} /> Trusted by 5,000+ learners
          </div>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: 'white',
            lineHeight: 1.15, marginBottom: 20
          }}>
            Master In-Demand Skills with Expert Courses
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', marginBottom: 36, lineHeight: 1.7 }}>
            Learn Spring Boot, React, PostgreSQL and more from industry professionals.
            Purchase once, learn forever.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to="/courses" className="btn btn-lg" style={{ background: 'white', color: '#185FA5' }}>
                Browse Courses <FiArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-lg" style={{ background: 'white', color: '#185FA5' }}>
                  Get Started Free <FiArrowRight size={16} />
                </Link>
                <Link to="/login" className="btn btn-lg" style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: 'white', border: '1.5px solid rgba(255,255,255,0.3)'
                }}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'white', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
          <div className="grid-4">
            {stats.map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#185FA5' }}>{value}</div>
                <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '72px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, color: '#042C53', marginBottom: 48 }}>
          Why EduCommerce?
        </h2>
        <div className="grid-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card" style={{ padding: 28, textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: '#E6F1FB', margin: '0 auto 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={24} color="#185FA5" />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#042C53', marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section style={{ background: '#E6F1FB', padding: '60px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#042C53', marginBottom: 12 }}>
            Ready to start learning?
          </h2>
          <p style={{ color: '#475569', marginBottom: 24 }}>
            Join thousands of students growing their careers today.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Free Account <FiArrowRight size={16} />
          </Link>
        </section>
      )}

      {/* Footer */}
      <footer style={{ background: '#042C53', padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
          © 2025 EduCommerce. Built with Spring Boot + React + PostgreSQL.
        </p>
      </footer>
    </div>
  )
}
