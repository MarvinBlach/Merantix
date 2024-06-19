function fetchXMLData(url) {
    return fetch(url)
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"));
}

// This function processes the XML and returns job listings by category
function processXML(xml) {
    const positions = xml.getElementsByTagName('position');
    const categories = {};

    // Loop through each position and categorize
    for (let position of positions) {
        // Safely get text content or return null if not found
        const safeTextContent = (elems) => elems.length > 0 ? elems[0].textContent : null;

        const id = safeTextContent(position.getElementsByTagName('id'));
        const category = safeTextContent(position.getElementsByTagName('department'));
        const title = safeTextContent(position.getElementsByTagName('name'));
        const employmentType = safeTextContent(position.getElementsByTagName('employmentType'));
        const location = safeTextContent(position.getElementsByTagName('office'));
        const recruitingCategory = safeTextContent(position.getElementsByTagName('recruitingCategory'));
        const schedule = safeTextContent(position.getElementsByTagName('schedule'));

        // Skip adding job if mandatory fields are missing
        if (!id || !category || !title || !employmentType || !location || !recruitingCategory || !schedule) {
            continue; // Skip this iteration if essential information is missing
        }

        // Create category if it doesn't exist
        if (!categories[category]) {
            categories[category] = [];
        }

        // Add job to the category
        categories[category].push({ id, title, employmentType, location, recruitingCategory, schedule });
    }

    return categories;
}

function generateHTMLForCategories(categories) {
    let html = '';

    for (let category in categories) {
        html += `<section id="engineering-team" j-wrapper="" class="section-kaj is-first">
                    <div class="padding-global">
                        <div class="container-large">
                            <h1 j-category="" class="heading-style-h2 fade-normal" style="will-change: opacity, transform; opacity: 1; transform: translate3d(0px, 0rem, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;">
                                ${category}
                            </h1>
                            <div class="kaj-cat">
                                <div class="kaj-cl-wrapper">
                                    <div class="kaj-cl">`;

        categories[category].forEach(job => {
            const jobLink = `https://merantix-momentum.jobs.personio.com/job/${job.id}?language=en&display=en`;
            html += `<div j-item="" class="kaj-cl-item fade-normal" style="will-change: opacity, transform; opacity: 1; transform: translate3d(0px, 0rem, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;">
                        <a j-link="" href="${jobLink}" target="_blank" class="kaj-link w-inline-block">
                            <div class="kaj-left">
                                <div class="text-style-allcaps">
                                    <h3 j-title="" class="heading-style-h4 is-job-title">${job.title}</h3>
                                </div>
                                <div class="spacer-1-00-rem"></div>
                                <div class="kaj-left-info">
                                    <div j-category="" fs-cmsfilter-field="category" class="text-size-link-16px">${job.recruitingCategory}</div>
                                    <div j-hours="" class="text-size-link-16px">${job.schedule}</div>
                                    <div j-location="" class="text-size-link-16px">${job.location}</div>
                                </div>
                            </div>
                            <div class="kaj-link-icon-wrapper">
                                <div class="kaj-link-icon w-embed">
                                    <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 52 52" style="enable-background:new 0 0 52 52;" xml:space="preserve">
                                        <style type="text/css">
                                            .kaj-link-icon-svg{fill:currentColor;}
                                        </style>
                                        <path class="kaj-link-icon-svg" d="M13,36.8l20.7-20.7H14.9V13H39v24.1h-3.1V18.3L15.2,39L13,36.8z"></path>
                                    </svg>
                                </div>
                            </div>
                        </a>
                    </div>`;
        });

        html += `         </div>
                        </div>
                    </div>
                </div>
            </section>`;
    }

    return html;
}


const url = 'https://merantix-momentum.jobs.personio.com/xml';

fetchXMLData(url)
    .then(xml => {
        const categories = processXML(xml);
        const html = generateHTMLForCategories(categories);
        document.getElementById('job-listings').innerHTML = html; // Assuming there's a div with id 'job-listings' to hold the content
    })
    .catch(error => {
        console.error('Error fetching or processing XML data:', error);
    });
