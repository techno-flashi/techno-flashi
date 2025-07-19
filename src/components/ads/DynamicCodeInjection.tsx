import { getCodeInjections, type CodeInjection } from '@/lib/supabase-ads';

interface DynamicCodeInjectionProps {
  position: 'head_start' | 'head_end' | 'body_start' | 'footer';
  currentPage?: string;
}

export default async function DynamicCodeInjection({
  position,
  currentPage = '/'
}: DynamicCodeInjectionProps) {
  try {
    const injections = await getCodeInjections(position, currentPage);

    if (injections.length === 0) {
      return null;
    }

    return (
      <>
        {injections.map((injection) => (
          <div
            key={injection.id}
            data-injection-id={injection.id}
            data-injection-name={injection.name}
            data-injection-position={injection.position}
            dangerouslySetInnerHTML={{ __html: injection.code }}
          />
        ))}
      </>
    );
  } catch (error) {
    console.error(`Error loading code injections for position ${position}:`, error);
    return null;
  }
}

// Pre-built templates for common use cases
export const CODE_INJECTION_TEMPLATES = {
  'google-analytics-4': {
    name: 'Google Analytics 4',
    position: 'head_end' as const,
    code: `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>`,
    priority: 10
  },
  'meta-pixel': {
    name: 'Meta Pixel',
    position: 'head_end' as const,
    code: `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>`,
    priority: 9
  },
  'google-adsense-auto': {
    name: 'Google AdSense Auto Ads',
    position: 'head_end' as const,
    code: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>`,
    priority: 8
  },
  'custom-css': {
    name: 'Custom CSS Styles',
    position: 'head_end' as const,
    code: `<style>
/* Add your custom CSS here */
.custom-banner {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px;
  text-align: center;
}
</style>`,
    priority: 5
  },
  'push-notifications': {
    name: 'Push Notification Script',
    position: 'footer' as const,
    code: `<script>
// Push notification initialization
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Push notifications supported');
  // Add your push notification code here
}
</script>`,
    priority: 3
  },
  'monetag-vignette': {
    name: 'Monetag Vignette (gizokraijaw.net)',
    position: 'head_end' as const,
    code: `<script>(function(d,z,s){s.src='https://'+d+'/401/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('gizokraijaw.net',9594022,document.createElement('script'))</script>`,
    priority: 9
  },
  'monetag-banner-new': {
    name: 'Monetag Banner (gizokraijaw.net)',
    position: 'head_end' as const,
    code: `<script>(function(d,z,s){s.src='https://'+d+'/400/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('gizokraijaw.net',ZONE_ID,document.createElement('script'))</script>`,
    priority: 8
  }
};
