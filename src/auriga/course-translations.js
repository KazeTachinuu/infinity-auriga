/**
 * Local course/module translations extracted from official EPITA report cards.
 *
 * Auriga often returns only { fr: ... } for pedagogical unit captions, so these
 * translations are kept locally for future display/export use.
 */
export const COURSE_TRANSLATIONS_EN = {
    // Modules / UEs
    'Concevoir': 'Design',
    'Formaliser': 'Formalize',
    'Gérer': 'Manage',
    'Produire': 'Produce',
    'Développement sécurisé': 'Secure Development',
    'Tests d’intrusions': 'Penetration Testing',
    "Tests d'intrusions": 'Penetration Testing',
    'Agir': 'Act',
    'Piloter': 'Lead',
    'Apprentissage en entreprise': 'On-the-Job Training',

    // Courses
    'Codes correcteurs': 'Correction codes',
    'Intelligence Artificielle pour la Cybersécurité': 'Artificial Intelligence for Cybersecurity',
    'Probabilités discrètes': 'Discrete Probabilities',
    'Innovation collaborative': 'Collaborative innovation',
    'Gestion de la sécurité en entreprise': 'Corporate Security Management',
    'Sécurité Windows': 'Windows Security',
    'Concepts LAN': 'LAN concepts',
    'Assembleur': 'Assembler',
    'Développement sécurisé - Projet': 'Secure Development - Project',
    "Méthodes d'audit de sécurité": 'Penetration Testing - Security Audit Methods',
    'Test d’intrusion': 'Penetration Testing',
    "Test d'intrusion": 'Penetration Testing',
    'Projet Shell': 'Shell Project',
    'Anglais-3': 'English-3',
    'Anglais-4': 'English-4',
    'Gestion de projet agile': 'Agile project management',
    "Evaluation de l'apprentissage en entreprise": 'Assessment of On-the-Job Training',
};

export function translateCourseName(name) {
    return COURSE_TRANSLATIONS_EN[name] || name;
}
