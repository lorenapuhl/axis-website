- Build sections/AboutmeSection.tsx 
- Use the following HTML code as a template. Adapt it to Axis design, animations, and rules specified in
* @skills/component.md
* @skills/animate-section.md
* @skills/seo.md
- Ask me to specify any contradictions between the HTML code and the rules specified in the skills
- Use stagger effects for all stats and features cards



<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
:root {
  --accent: #0033FF; /* Your Electric Blue accent */
  --on-dark: #f0ede6;
  --muted: #888880;
  --border: rgba(255,255,255,0.08);
  --card-bg: rgba(255,255,255,0.04);
}
.ab-wrap {
  background: #000000; /* Solid Black per your aesthetic */
  color: var(--on-dark);
  font-family: 'DM Sans', sans-serif;
  padding: 80px 0 100px;
  position: relative;
  overflow: hidden;
}
.ab-wrap::before {
  content: '';
  position: absolute;
  top: -120px;
  right: -80px;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(0, 51, 255, 0.1) 0%, transparent 70%);
  pointer-events: none;
}
.ab-inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 32px;
}
.ab-label {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 500;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.ab-label::after {
  content: '';
  display: block;
  width: 32px;
  height: 1px;
  background: var(--accent);
  opacity: 0.5;
}
.ab-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 56px;
  align-items: start;
}
.ab-portrait {
  width: 100%;
  aspect-ratio: 3/4;
  background: var(--card-bg);
  border: 0.5px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ab-portrait-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.25;
}
.ab-portrait-placeholder svg {
  width: 48px;
  height: 48px;
}
.ab-portrait-placeholder span {
  font-size: 12px;
  color: var(--muted);
}
.ab-portrait-tag {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: rgba(18, 18, 18, 0.9);
  border: 0.5px solid var(--border);
  border-radius: 3px;
  padding: 8px 12px;
}
.ab-portrait-tag .name {
  font-size: 13px;
  font-weight: 500;
  color: var(--on-dark);
  margin: 0 0 2px;
}
.ab-portrait-tag .role {
  font-size: 11px;
  color: var(--muted);
  margin: 0;
}
.ab-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.ab-stat {
  background: var(--card-bg);
  border: 0.5px solid var(--border);
  border-radius: 4px;
  padding: 14px 16px;
}
.ab-stat .num {
  font-family: 'DM Serif Display', serif;
  font-size: 22px;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 4px;
}
.ab-stat .desc {
  font-size: 11px;
  color: var(--muted);
  line-height: 1.4;
}
.ab-heading {
  font-family: 'DM Serif Display', serif;
  font-size: 38px;
  line-height: 1.15;
  color: var(--on-dark);
  margin: 0 0 28px;
  font-weight: 400;
}
.ab-heading em {
  font-style: italic;
  color: var(--accent);
}
.ab-body {
  font-size: 15px;
  line-height: 1.8;
  color: #a8a89e;
  margin: 0 0 20px;
}
.ab-body strong {
  color: var(--on-dark);
  font-weight: 500;
}
.ab-divider {
  width: 40px;
  height: 1px;
  background: var(--border);
  margin: 32px 0;
}
.ab-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 28px;
}
.ab-pill {
  font-size: 12px;
  color: var(--muted);
  border: 0.5px solid rgba(255,255,255,0.1);
  border-radius: 40px;
  padding: 6px 14px;
  letter-spacing: 0.02em;
}
.ab-quote-block {
  border-left: 2px solid var(--accent);
  padding: 4px 0 4px 20px;
  margin: 32px 0;
}
.ab-quote-block p {
  font-family: 'DM Serif Display', serif;
  font-size: 18px;
  font-style: italic;
  color: var(--on-dark);
  line-height: 1.5;
  margin: 0;
}
.ab-cta-row {
  margin-top: 36px;
  display: flex;
  align-items: center;
  gap: 20px;
}
.ab-cta {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  background: var(--accent);
  color: #ffffff;
  border: none;
  border-radius: 3px;
  padding: 11px 22px;
  cursor: pointer;
  letter-spacing: 0.02em;
}
.ab-link {
  font-size: 13px;
  color: var(--muted);
  text-decoration: none;
  border-bottom: 0.5px solid rgba(136,136,128,0.4);
  padding-bottom: 1px;
}
@media (max-width: 600px) {
  .ab-grid { grid-template-columns: 1fr; gap: 40px; }
  .ab-heading { font-size: 28px; }
}
</style>

<div class="ab-wrap">
  <div class="ab-inner">
    <div class="ab-label">Founding Story</div>
    <div class="ab-grid">
      <div class="ab-left">
        <div class="ab-portrait">
          <div class="ab-portrait-placeholder">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="18" r="10" stroke="white" stroke-width="1.5"/>
              <path d="M6 42c0-9.94 8.06-18 18-18s18 8.06 18 18" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>Lorena Puhl</span>
          </div>
          <div class="ab-portrait-tag">
            <p class="name">Lorena Puhl</p>
            <p class="role">Physicist & Tech Founder</p>
          </div>
        </div>
        <div class="ab-stats">
          <div class="ab-stat">
            <div class="num">M.Sc.</div>
            <div class="desc">Statistical bold(Physics), Heidelberg (DE)</div>
          </div>
          <div class="ab-stat">
            <div class="num">5+</div>
            <div class="desc">Years of engineering bold(data systems)</div>
          </div>
          <div class="ab-stat">
            <div class="num">5</div>
            <div class="desc">bold(Languages) (DE, FR, EN, ES, NL) </div>
          </div>
          
          <div class="ab-stat">
            <div class="num">6</div>
            <div class="desc">bold(Countries) (DE, BEL, FR, HK, ES, MX) </div>
          </div>
        <div class="ab-stat">
            <div class="num">6</div>
            <div class="desc"> bold(Sports) (Karate, Tennis, Swimming, Yoga, Dancing, Boxing)</div>
          </div>

        <div class="ab-stat">
            <div class="num">100%</div>
            <div class="desc">bold(Automation-oriented)</div>
        </div>
          
        </div>
      </div>
      <div class="ab-right">
        <h2 class="ab-heading">Built by a scientist, <em>designed for the studio floor.</em></h2>
        <p class="ab-body">I spent years as a Data Scientist and Physicist, building complex Machine Learning (ML)-models, conducting research, and working for private businesses and embassies. But I noticed a pattern in my own neighborhood: my favorite dancing, boxing, and karate studios were being held back by their own success.</p>
        
        <p class="ab-body"><strong>They were crushing it on Instagram, but drowning in DMs. They had incredible classes, but no presence on Google.</strong> I realized that the tech being used for big startups was too complex for local studios, and the simple tools were too clunky. So, I built italic(Axis).</p>

        <div class="ab-quote-block">
          <p>"I take the same rigor used in ML-research and apply it to one goal: making your studio grow while you sleep."</p>
        </div>

        <p class="ab-body">Italic(Axis) isn't just another website builder. It's an automated growth engine. It takes the content you’re already creating on Instagram and transforms it into a high-converting, professional booking platform. No manual updates. No coding. No technical debt.</p>

        <p class="ab-body">I’ve spent my career engineering systems that work; now, I’m building them so you can stop managing your DM's and start scaling your community.</p>
        
        <div class="ab-divider"></div>
        
        <div class="ab-pills">
          <span class="ab-pill">Next.js Development</span>
          <span class="ab-pill">Machine Learning Architecture</span>
          <span class="ab-pill">Business Automation</span>
          <span class="ab-pill">UI/UX for SaaS</span>
          <span class="ab-pill">Belgium/Mexico City</span>
        </div>
        
        <div class="ab-cta-row">
          <button class="ab-cta">Let's get in touch</button>
          <a class="ab-link" href="https://linkedin.com/in/lorena-puhl">LinkedIn ↗</a>
        </div>
      </div>
    </div>
  </div>
</div>
