// IBM's Tealium/GA set up (ibm-common.js), shared by the manager
// (index.html) and the preview (iframe.html) through `managerHead` and
// `previewHead` in main.ts. The values match other Carbon Storybooks
// (@carbon/react, carbon-components-vue, carbon-components-angular).

const IBM_COMMON_SRC = 'https://1.www.s81c.com/common/stats/ibm-common.js';

/**
 * The head markup that loads `ibm-common.js` on each page.
 *
 * @param siteName - the `_ibmAnalytics.settings.name` for this Storybook
 */
export function getIbmAnalyticsHeads(siteName: string) {
  const ibmAnalytics = {
    settings: {
      name: siteName,
      isSpa: true,
      tealiumProfileName: 'ibm-web-app',
    },
    onLoad: [['ibmStats.pageview', []]],
  };

  const digitalData = {
    page: {
      pageInfo: {
        ibm: {
          siteId: `IBM_${siteName}`,
        },
      },
      category: {
        primaryCategory: 'PC100',
      },
    },
  };

  const setGlobals = `
    window._ibmAnalytics = ${JSON.stringify(ibmAnalytics)};
    window.digitalData = ${JSON.stringify(digitalData)};
  `;

  // The manager is always the top-level window, so it sets the globals and
  // loads ibm-common.js with a static script tag.
  const managerAnalyticsHead = `
    <script type="text/javascript">${setGlobals}</script>
    <script src="${IBM_COMMON_SRC}" type="text/javascript" async="async"></script>
  `;

  // The preview loads ibm-common.js only when opened on its own: inside the
  // manager, the manager has already loaded it.
  const previewAnalyticsHead = `
    <script type="text/javascript">
      if (window.self === window.top) {${setGlobals}
        var ibmCommonScript = document.createElement('script');
        ibmCommonScript.type = 'text/javascript';
        ibmCommonScript.async = true;
        ibmCommonScript.src = '${IBM_COMMON_SRC}';
        document.head.appendChild(ibmCommonScript);
      }
    </script>
  `;

  return { managerAnalyticsHead, previewAnalyticsHead };
}
