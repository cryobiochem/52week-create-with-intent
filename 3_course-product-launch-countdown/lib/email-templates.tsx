// Email templates for the 5-email launch sequence
// Based on the Course/Product Launch Countdown System specification

export interface EmailTemplate {
  subject: string;
  preheader: string;
  body: string;
}

export const emailTemplates = {
  // Day 1: Welcome + Value Email
  welcome: {
    subject: "Welcome to LaunchPad! Here's what to expect...",
    preheader: "You're on the list for early access",
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to LaunchPad</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #4f46e5; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">LaunchPad</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #18181b; font-size: 20px;">You're in! {{name}}</h2>
              
              <p style="margin: 0 0 16px; color: #52525b; line-height: 1.6;">
                Thank you for joining the LaunchPad waitlist. You're now part of an exclusive group 
                of founders who will get early access to everything we're building.
              </p>
              
              <p style="margin: 0 0 24px; color: #52525b; line-height: 1.6;">
                <strong>Here's what you can expect:</strong>
              </p>
              
              <ul style="margin: 0 0 24px; padding-left: 20px; color: #52525b; line-height: 1.8;">
                <li>Early access before the public launch</li>
                <li>Exclusive launch pricing (save up to 40%)</li>
                <li>Behind-the-scenes updates on our progress</li>
                <li>Input on features we're building</li>
              </ul>
              
              <p style="margin: 0 0 24px; color: #52525b; line-height: 1.6;">
                We're building LaunchPad because we know how frustrating it is to spend months on 
                boilerplate instead of building your actual product. We've been there.
              </p>
              
              <p style="margin: 0; color: #52525b; line-height: 1.6;">
                Stay tuned for more updates!<br><br>
                — The LaunchPad Team
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f4f4f5; padding: 24px; text-align: center;">
              <p style="margin: 0; color: #71717a; font-size: 12px;">
                © 2026 LaunchPad. All rights reserved.<br>
                <a href="{{unsubscribe_url}}" style="color: #71717a;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  // Day 3: Problem Agitation Email
  problem: {
    subject: "The hidden cost of building from scratch",
    preheader: "This is costing you more than you think",
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #4f46e5; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">LaunchPad</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #18181b; font-size: 20px;">The real cost of "building it yourself"</h2>
              
              <p style="margin: 0 0 16px; color: #52525b; line-height: 1.6;">
                Hey {{name}},
              </p>
              
              <p style="margin: 0 0 16px; color: #52525b; line-height: 1.6;">
                Quick question: How much time have you spent on authentication, billing, 
                or user management in the last year?
              </p>
              
              <p style="margin: 0 0 16px; color: #52525b; line-height: 1.6;">
                For most founders we talked to, the answer is <strong>2-4 months</strong>. 
                That's 2-4 months NOT building features your customers actually want.
              </p>
              
              <p style="margin: 0 0 16px; color: #52525b; line-height: 1.6;">
                Here's what that really costs:
              </p>
              
              <ul style="margin: 0 0 24px; padding-left: 20px; color: #52525b; line-height: 1.8;">
                <li>Lost revenue from delayed launch</li>
                <li>Competitor advantage as they ship faster</li>
                <li>Technical debt from rushed implementations</li>
                <li>Burnout from doing the same work over and over</li>
              </ul>
              
              <p style="margin: 0 0 24px; color: #52525b; line-height: 1.6;">
                We built LaunchPad specifically to solve this problem. Everything you need, 
                ready to go, so you can focus on what makes your product unique.
              </p>
              
              <p style="margin: 0; color: #52525b; line-height: 1.6;">
                More details coming soon.<br><br>
                — The LaunchPad Team
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f4f4f5; padding: 24px; text-align: center;">
              <p style="margin: 0; color: #71717a; font-size: 12px;">
                © 2026 LaunchPad. All rights reserved.<br>
                <a href="{{unsubscribe_url}}" style="color: #71717a;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  // Day 5: Social Proof Email
  socialProof: {
    subject: "What beta testers are saying about LaunchPad",
    preheader: "Real results from real founders",
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #4f46e5; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">LaunchPad</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #18181b; font-size: 20px;">Don't take our word for it</h2>
              
              <p style="margin: 0 0 24px; color: #52525b; line-height: 1.6;">
                Hey {{name}},
              </p>
              
              <p style="margin: 0 0 24px; color: #52525b; line-height: 1.6;">
                We've been quietly testing LaunchPad with a small group of founders. 
                Here's what they're saying:
              </p>
              
              <!-- Testimonial 1 -->
              <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
                <p style="margin: 0 0 12px; color: #18181b; font-style: italic;">
                  "LaunchPad cut our time to market by 3 months. The billing integration 
                  alone saved us weeks of development."
                </p>
                <p style="margin: 0; color: #71717a; font-size: 14px;">
                  — Sarah Chen, Founder of DataSync
                </p>
              </div>
              
              <!-- Testimonial 2 -->
              <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
                <p style="margin: 0 0 12px; color: #18181b; font-style: italic;">
                  "As a solo founder, I couldn't afford to waste time on infrastructure. 
                  LaunchPad let me focus on my users."
                </p>
                <p style="margin: 0; color: #71717a; font-size: 14px;">
                  — Emily Rodriguez, Solo Founder of TaskMaster
                </p>
              </div>
              
              <!-- Testimonial 3 -->
              <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px; color: #18181b; font-style: italic;">
                  "The best investment we made for our startup. Went from idea to 
                  paying customers in just 6 weeks."
                </p>
                <p style="margin: 0; color: #71717a; font-size: 14px;">
                  — Marcus Johnson, CTO of Flowwise
                </p>
              </div>
              
              <p style="margin: 0; color: #52525b; line-height: 1.6;">
                Ready to join them? Launch day is almost here.<br><br>
                — The LaunchPad Team
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f4f4f5; padding: 24px; text-align: center;">
              <p style="margin: 0; color: #71717a; font-size: 12px;">
                © 2026 LaunchPad. All rights reserved.<br>
                <a href="{{unsubscribe_url}}" style="color: #71717a;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  // Day 7: Launch Announcement
  launch: {
    subject: "We're LIVE! Get your exclusive launch pricing",
    preheader: "Early bird pricing ends in 48 hours",
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #4f46e5; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">LaunchPad is LIVE!</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #18181b; font-size: 20px;">The wait is over, {{name}}!</h2>
              
              <p style="margin: 0 0 16px; color: #52525b; line-height: 1.6;">
                LaunchPad is officially live, and as a waitlist member, you get exclusive 
                access to our launch pricing.
              </p>
              
              <p style="margin: 0 0 24px; color: #52525b; line-height: 1.6;">
                <strong>This pricing disappears in 48 hours.</strong> After that, prices go up 
                by 40% and will never be this low again.
              </p>
              
              <!-- Pricing Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #f4f4f5; border-radius: 8px;">
                    <table width="100%">
                      <tr>
                        <td><strong>Starter</strong></td>
                        <td style="text-align: right;"><span style="text-decoration: line-through; color: #71717a;">$49</span> <strong>$29/mo</strong></td>
                      </tr>
                      <tr>
                        <td><strong>Pro</strong> (Most popular)</td>
                        <td style="text-align: right;"><span style="text-decoration: line-through; color: #71717a;">$149</span> <strong>$99/mo</strong></td>
                      </tr>
                      <tr>
                        <td><strong>Scale</strong></td>
                        <td style="text-align: right;"><span style="text-decoration: line-through; color: #71717a;">$399</span> <strong>$299/mo</strong></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{checkout_url}}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                      Get Started Now
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; color: #52525b; line-height: 1.6; text-align: center;">
                <small>30-day money-back guarantee. Cancel anytime.</small>
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f4f4f5; padding: 24px; text-align: center;">
              <p style="margin: 0; color: #71717a; font-size: 12px;">
                © 2026 LaunchPad. All rights reserved.<br>
                <a href="{{unsubscribe_url}}" style="color: #71717a;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },

  // Day 8: Last Chance Email
  lastChance: {
    subject: "FINAL HOURS: Launch pricing ends tonight",
    preheader: "This is your last chance to save 40%",
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #dc2626; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">FINAL HOURS</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #18181b; font-size: 20px;">{{name}}, this is it.</h2>
              
              <p style="margin: 0 0 16px; color: #52525b; line-height: 1.6;">
                Launch pricing ends at midnight tonight. After that, prices increase by 40% 
                and will <strong>never be this low again</strong>.
              </p>
              
              <p style="margin: 0 0 24px; color: #52525b; line-height: 1.6;">
                I wanted to send you one last reminder because I don't want you to 
                miss out on the savings.
              </p>
              
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; color: #991b1b; font-weight: bold; text-align: center;">
                  Price increase in less than 12 hours
                </p>
              </div>
              
              <p style="margin: 0 0 24px; color: #52525b; line-height: 1.6;">
                <strong>What you get:</strong>
              </p>
              
              <ul style="margin: 0 0 24px; padding-left: 20px; color: #52525b; line-height: 1.8;">
                <li>Complete SaaS boilerplate (auth, billing, teams)</li>
                <li>Beautiful, production-ready components</li>
                <li>Analytics dashboard built-in</li>
                <li>30-day money-back guarantee</li>
              </ul>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{checkout_url}}" style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                      Lock In Your Price Now
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; color: #52525b; line-height: 1.6;">
                Don't let this slip away.<br><br>
                — The LaunchPad Team
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f4f4f5; padding: 24px; text-align: center;">
              <p style="margin: 0; color: #71717a; font-size: 12px;">
                © 2026 LaunchPad. All rights reserved.<br>
                <a href="{{unsubscribe_url}}" style="color: #71717a;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },
};

// Helper function to render template with variables
export function renderEmailTemplate(
  template: EmailTemplate,
  variables: Record<string, string>
): EmailTemplate {
  let body = template.body;
  let subject = template.subject;
  let preheader = template.preheader;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    body = body.replace(new RegExp(placeholder, "g"), value);
    subject = subject.replace(new RegExp(placeholder, "g"), value);
    preheader = preheader.replace(new RegExp(placeholder, "g"), value);
  }

  return { subject, preheader, body };
}
