/**
 * Team Registry - Staff bios and certifications
 */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  slug: string;
  bio: string;
  shortBio: string;
  image?: string;
  certifications: string[];
  experience: number; // years
  specialties: string[];
  featured: boolean;
  contact?: {
    email?: string;
    phone?: string;
  };
  social?: {
    linkedin?: string;
    facebook?: string;
  };
}

const team: TeamMember[] = [
  {
    id: 'ron',
    name: 'Ron "Grandpa Ron" Henderson',
    role: 'Founder & Owner',
    slug: 'ron-henderson',
    bio: `Ron Henderson, affectionately known as "Grandpa Ron," founded Grandpa Ron's Landscaping with a simple mission: provide quality work and build lasting relationships with customers. With over 35 years of experience in landscaping and property maintenance, Ron brings old-fashioned work ethic combined with modern techniques to every job.

A lifelong Central Ohio resident, Ron started mowing lawns as a teenager and never stopped. He's seen the industry evolve and has consistently adapted while maintaining the core values that made him successful: show up on time, do quality work, clean up after yourself, and treat every customer's property like your own.

When he's not on a job site, Ron enjoys spending time with his grandchildren (who inspired the business name), fishing at local lakes, and tending to his own extensive garden.`,
    shortBio: 'Founder with 35+ years of landscaping experience. Bringing old-fashioned work ethic to modern landscaping.',
    image: '/img/GrandpaRon.png',
    certifications: [
      'Ohio Pesticide Applicator License',
      'OSHA 10 Safety Certified',
    ],
    experience: 35,
    specialties: ['Landscape Design', 'Tree Care', 'Customer Relations'],
    featured: true,
    contact: {
      phone: '(220) 666-2520',
    },
  },
  {
    id: 'marcus',
    name: 'Marcus Williams',
    role: 'Operations Manager',
    slug: 'marcus-williams',
    bio: `Marcus Williams joined Grandpa Ron's team 8 years ago as a crew member and quickly rose through the ranks due to his exceptional work ethic and leadership abilities. Now serving as Operations Manager, Marcus oversees daily operations, crew scheduling, and quality control.

Marcus earned his degree in Horticulture from Ohio State University and brings both academic knowledge and hands-on expertise to the team. He's particularly skilled at diagnosing lawn and plant health issues and designing irrigation solutions.

A Columbus native, Marcus is passionate about sustainable landscaping practices and has been instrumental in introducing eco-friendly options to our service offerings.`,
    shortBio: 'OSU Horticulture graduate managing daily operations and quality control.',
    certifications: [
      'B.S. Horticulture, Ohio State University',
      'Irrigation Association Certified Technician',
      'Ohio Pesticide Applicator License',
    ],
    experience: 8,
    specialties: ['Operations', 'Irrigation', 'Plant Health', 'Sustainable Practices'],
    featured: true,
  },
  {
    id: 'elena',
    name: 'Elena Rodriguez',
    role: 'Landscape Designer',
    slug: 'elena-rodriguez',
    bio: `Elena Rodriguez brings creative vision and technical expertise to Grandpa Ron's landscape design services. With a background in landscape architecture and 12 years of experience, Elena creates outdoor spaces that are both beautiful and functional.

Elena works closely with clients to understand their vision, lifestyle, and budget before developing custom designs. She's known for her attention to detail and ability to incorporate native plants that thrive in Central Ohio's climate.

Prior to joining Grandpa Ron's, Elena worked for a large landscape architecture firm in Columbus, where she designed commercial and residential projects throughout Ohio.`,
    shortBio: 'Creative landscape designer with 12 years of experience in residential and commercial design.',
    certifications: [
      'B.S. Landscape Architecture',
      'APLD Certified Landscape Designer',
    ],
    experience: 12,
    specialties: ['Landscape Design', 'Native Plants', 'Outdoor Living Spaces'],
    featured: true,
  },
  {
    id: 'james',
    name: 'James Chen',
    role: 'Tree Care Specialist',
    slug: 'james-chen',
    bio: `James Chen leads our tree care division with expertise developed over 15 years in arboriculture. A certified arborist, James is passionate about tree health and safety, ensuring every pruning cut and removal is done correctly and safely.

James started his career with the Ohio Department of Natural Resources before transitioning to private tree care. His experience includes everything from delicate ornamental pruning to large-scale tree removal and storm damage response.

He's particularly skilled at diagnosing tree diseases and developing treatment plans that extend the life of valuable landscape trees.`,
    shortBio: 'Certified arborist with 15 years of tree care expertise.',
    certifications: [
      'ISA Certified Arborist',
      'Tree Risk Assessment Qualified',
      'OSHA 30 Safety Certified',
    ],
    experience: 15,
    specialties: ['Tree Pruning', 'Tree Removal', 'Disease Diagnosis', 'Storm Damage'],
    featured: true,
  },
  {
    id: 'dave',
    name: 'Dave Murphy',
    role: 'Hardscape Foreman',
    slug: 'dave-murphy',
    bio: `Dave Murphy leads our hardscape installation crew, bringing 10 years of experience in paver patios, retaining walls, and outdoor living construction. His attention to detail and commitment to proper installation techniques ensure our hardscape projects stand the test of time.

Dave is an ICPI certified installer and stays current with the latest products and techniques through ongoing education. He's known for his problem-solving abilities, particularly when working on challenging sites with drainage or slope issues.`,
    shortBio: 'ICPI certified hardscape installer specializing in patios and retaining walls.',
    certifications: [
      'ICPI Certified Paver Installer',
      'Segmental Retaining Wall Installer',
      'OSHA 10 Safety Certified',
    ],
    experience: 10,
    specialties: ['Paver Installation', 'Retaining Walls', 'Drainage Solutions'],
    featured: false,
  },
  {
    id: 'sarah',
    name: 'Sarah Thompson',
    role: 'Customer Service Manager',
    slug: 'sarah-thompson',
    bio: `Sarah Thompson ensures every customer interaction with Grandpa Ron's is positive and professional. She manages scheduling, estimates, and customer communications, serving as the friendly voice you hear when you call.

With a background in hospitality management and 5 years with our team, Sarah understands the importance of clear communication and follow-through. She takes pride in making the scheduling process smooth and ensuring customers know exactly what to expect.`,
    shortBio: 'Friendly customer service manager ensuring smooth scheduling and communication.',
    certifications: [],
    experience: 5,
    specialties: ['Customer Service', 'Scheduling', 'Communications'],
    featured: false,
  },
];

// ============================================
// TEAM REGISTRY CLASS
// ============================================

class TeamRegistry {
  private members: TeamMember[];

  constructor() {
    this.members = team;
  }

  getAllMembers(): TeamMember[] {
    return this.members;
  }

  getMemberById(id: string): TeamMember | undefined {
    return this.members.find(m => m.id === id);
  }

  getMemberBySlug(slug: string): TeamMember | undefined {
    return this.members.find(m => m.slug === slug);
  }

  getFeaturedMembers(): TeamMember[] {
    return this.members.filter(m => m.featured);
  }

  getMembersBySpecialty(specialty: string): TeamMember[] {
    return this.members.filter(m =>
      m.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
    );
  }

  getTotalExperience(): number {
    return this.members.reduce((sum, m) => sum + m.experience, 0);
  }

  getAllCertifications(): string[] {
    const certSet = new Set<string>();
    this.members.forEach(m => m.certifications.forEach(c => certSet.add(c)));
    return [...certSet];
  }

  /**
   * Generate static params for Next.js
   */
  getStaticParams(): Array<{ slug: string }> {
    return this.members.map(m => ({ slug: m.slug }));
  }
}

export const teamRegistry = new TeamRegistry();
