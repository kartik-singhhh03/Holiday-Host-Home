import os
import re

CSS_NAV_OLD = r"""\.nav\s*{\s*position:\s*fixed;\s*top:\s*0;\s*left:\s*0;\s*right:\s*0;[^}]+\}"""
CSS_SCROLLED_OLD = r"""\.nav\.scrolled\s*{[^}]+\}"""
CSS_TEXT_COLOR_OLD = r"""\.nav\s+a:not\(\.nav-cta\),\s*\.logo-main,\s*\.logo-sub\s*{\s*color:\s*var\(--white\)\s*!important;\s*\}"""

def update_css():
    with open('style.css', 'r', encoding='utf-8') as f:
        content = f.read()

    # Nav style overrides
    content = re.sub(
        r'\.nav\s*\{[^}]+\}',
        ".nav {\n  position: fixed; top: 0; left: 0; right: 0;\n  z-index: 9999;\n  padding: 16px 48px;\n  display: flex; align-items: center; justify-content: space-between;\n  transition: var(--transition);\n  background: rgba(255, 255, 255, 0.92);\n  backdrop-filter: blur(16px);\n  -webkit-backdrop-filter: blur(16px);\n  border-bottom: 1px solid rgba(0,0,0,0.06);\n  box-shadow: 0 4px 20px rgba(0,0,0,0.04);\n}",
        content
    )
    
    # White color rules removal
    content = re.sub(r'\.nav a:not\(\.nav-cta\), \.logo-main, \.logo-sub\s*\{\s*color:\s*var\(--white\)\s*!important;\s*\}', 
                     ".nav a:not(.nav-cta), .logo-main { color: var(--text-dark) !important; }\n.nav .logo-sub { color: var(--primary-dark) !important; }", content)
    
    # Update scrolled state (can keep it for smoothness)
    content = re.sub(
        r'\.nav\.scrolled\s*\{[^}]+\}',
        ".nav.scrolled {\n  background: rgba(255,255,255,.98);\n  padding: 14px 48px;\n  box-shadow: 0 4px 24px rgba(0,0,0,0.08);\n}",
        content
    )
    
    content = re.sub(
        r'\.nav\.scrolled a:not\(\.nav-cta\), \.nav\.scrolled \.logo-main\s*\{\s*color:\s*var\(--text-dark\)\s*!important;\s*\}', 
        "", content
    )
    content = re.sub(
        r'\.nav\.scrolled \.logo-sub\s*\{\s*color:\s*var\(--primary-dark\)\s*!important;\s*\}', 
        "", content
    )

    # Hamburger color
    content = re.sub(
        r'\.nav-hamburger span\s*\{.*?background:\s*var\(--white\).*?\}',
        ".nav-hamburger span {\n  display: block; width: 24px; height: 2px;\n  background: var(--text-dark); border-radius: 2px; transition: var(--transition-fast);\n}",
        content, flags=re.DOTALL
    )

    # Hover link after
    content = re.sub(
        r'\.nav-links a:not\(\.nav-cta\)::after\s*\{.*?background:\s*var\(--white\).*?\}',
        ".nav-links a:not(.nav-cta)::after {\n  content: ''; position: absolute; bottom: -3px; left: 0; right: 0; height: 1px;\n  background: var(--primary-dark); transform: scaleX(0); transform-origin: left;\n  transition: transform .3s ease;\n}",
        content, flags=re.DOTALL
    )
    
    # Hover link color
    content = re.sub(
        r'\.nav-links a:not\(\.nav-cta\):hover\s*\{.*?color:\s*var\(--white\).*?\}',
        ".nav-links a:not(.nav-cta):hover { color: var(--primary-dark) !important; }",
        content, flags=re.DOTALL
    )

    # Add a generic background to the body or main element for UI improvement (subtle background)
    # The user asked for "Add subtle background (light gradient or blurred beach image like homepage style) ... Maintain luxury, minimal, premium design aesthetic"
    # Wait, they meant adding it to the footer or overall? "UI Improvement: Add subtle background (light gradient or blurred beach image like homepage style)" this might refer to the entire page. Let's add a very subtle body gradient.
    # Actually wait, maybe they mean the footer: "Add subtle background ... like homepage style". Let's check footer in style.css.
    
    # Let's ensure footer grid is correct and spacing is tight 
    content = re.sub(
        r'\.footer-top\s*\{.*?\}',
        ".footer-top { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; padding-bottom: 48px; border-bottom: 1px solid rgba(0,0,0,0.08); }",
        content, flags=re.DOTALL
    )
    
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(content)


NAV_HTML = """<nav class="nav" id="mainNav">
      <a href="index.html" class="nav-logo">
        <span class="logo-main">HHH</span>
        <span class="logo-sub">Holiday Home Host</span>
      </a>
      <ul class="nav-links" id="navLinks">
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="property-owners.html">For Owners</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="commission.html">Commission</a></li>
        <li><a href="listing-process.html">How It Works</a></li>
        <li><a href="index.html#contact" class="nav-cta">List Your Property</a></li>
      </ul>
      <button class="nav-hamburger" id="navHamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </nav>"""

FOOTER_HTML = """<footer class="footer" id="footer">
      <div class="footer-bg-image"></div>
      <div class="footer-overlay"></div>
      <div class="container footer-glass">
        <div class="footer-top">
          <div class="footer-brand">
            <div class="logo-main">HHH</div>
            <div class="logo-sub">Holiday Home Host</div>
            <p>Premium short-term rental management in Ras Al Khaimah — maximising owner returns and delivering exceptional guest experiences.</p>
            <div class="footer-social">
              <a href="#" class="social-icon" aria-label="Instagram"><span class="material-symbols-outlined">photo_camera</span></a>
              <a href="#" class="social-icon" aria-label="WhatsApp"><span class="material-symbols-outlined">chat_bubble</span></a>
              <a href="#" class="social-icon" aria-label="LinkedIn"><span class="material-symbols-outlined">work</span></a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="about.html">About HHH</a></li>
              <li><a href="services.html">Our Services</a></li>
              <li><a href="commission.html">Commission</a></li>
              <li><a href="index.html#contact">Contact Us</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Owners &amp; Partners</h4>
            <ul>
              <li><a href="property-owners.html">For Property Owners</a></li>
              <li><a href="commission.html">Commission Structure</a></li>
              <li><a href="listing-process.html">How It Works</a></li>
              <li><a href="roi-calculator.html">ROI Calculator</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:hello@holidayhomehost.ae">hello@holidayhomehost.ae</a></li>
              <li><a href="tel:+971501234567">+971 50 123 4567</a></li>
              <li>Hayat Island, Mina Al Arab</li>
              <li>Ras Al Khaimah, UAE</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Holiday Home Host. All rights reserved.</span>
          <span>
            <a href="#">Privacy Policy</a> &nbsp;·&nbsp; <a href="#">Terms of Service</a> &nbsp;·&nbsp; <a href="#">RAKTDA Licensed</a>
          </span>
        </div>
      </div>
    </footer>"""

def update_html_files():
    html_files = [f for f in os.listdir('.') if f.endswith('.html') and not f.startswith('LODGIFY')]
    
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Replace nav
        content = re.sub(
            r'<nav class="nav".*?</nav>',
            NAV_HTML,
            content,
            flags=re.DOTALL
        )
        
        # Replace footer
        content = re.sub(
            r'<footer class="footer".*?</footer>',
            FOOTER_HTML,
            content,
            flags=re.DOTALL
        )
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

if __name__ == '__main__':
    update_css()
    update_html_files()
    print("Done!")
