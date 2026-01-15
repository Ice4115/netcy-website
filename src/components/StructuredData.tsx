'use client';

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NETCY",
    "alternateName": ["Netcy", "Network Cybersecurity"],
    "url": "https://netcy.fr",
    "logo": "https://netcy.fr/images/logo_netcy.svg",
    "description": "Expert en création de sites web sécurisés et cybersécurité réseau à Montpellier. Développement Next.js, React, TypeScript et conseil en sécurité réseau pour PME.",
    "founder": {
      "@type": "Person",
      "name": "Jung Jean-Marie",
      "jobTitle": "Développeur Web & Expert Cybersécurité Réseau",
      "alumniOf": "BTS SIO SISR Montpellier"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Montpellier",
      "addressRegion": "Occitanie",
      "addressCountry": "FR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Service Client",
      "email": "contact@netcy.fr",
      "availableLanguage": ["French", "English"]
    },
    "sameAs": [
      "https://github.com/netcy",
      "https://linkedin.com/company/netcy"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "NETCY",
    "image": "https://netcy.fr/images/logo_netcy.svg",
    "@id": "https://netcy.fr",
    "url": "https://netcy.fr",
    "telephone": "",
    "priceRange": "€€",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "Montpellier",
      "postalCode": "34000",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 43.6108,
      "longitude": 3.8767
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://github.com/netcy"
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Création de Sites Web et Cybersécurité",
    "provider": {
      "@type": "Organization",
      "name": "NETCY"
    },
    "areaServed": {
      "@type": "City",
      "name": "Montpellier"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Services Web et Sécurité",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Création de Sites Web",
            "description": "Développement de sites vitrine, portfolio et e-commerce avec Next.js, React et TypeScript"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Maintenance et Support",
            "description": "Maintenance technique, mises à jour de sécurité, monitoring et sauvegardes"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Conseil en Cybersécurité Réseau",
            "description": "Audit de sécurité, conformité RGPD, configuration réseau sécurisée"
          }
        }
      ]
    }
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Jung Jean-Marie",
    "jobTitle": "Développeur Web Full Stack & Expert Cybersécurité Réseau",
    "worksFor": {
      "@type": "Organization",
      "name": "NETCY"
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "BTS SIO SISR Montpellier"
    },
    "knowsAbout": [
      "Développement Web",
      "Next.js",
      "React",
      "TypeScript",
      "Cybersécurité",
      "Sécurité Réseau",
      "RGPD",
      "Infrastructure Réseau"
    ],
    "url": "https://netcy.fr",
    "email": "contact@netcy.fr"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NETCY",
    "alternateName": "Network Cybersecurity",
    "url": "https://netcy.fr",
    "description": "Création de sites internet sécurisés et conseil en cybersécurité réseau à Montpellier",
    "inLanguage": "fr-FR",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://netcy.fr/?s={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://netcy.fr"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://netcy.fr#services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Contact",
        "item": "https://netcy.fr#contact"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
