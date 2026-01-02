/**
 * EQUIPMENT REGISTRY
 * Track equipment inventory, maintenance, and allocation
 *
 * Purpose: Optimize equipment utilization, schedule maintenance, track costs
 * Usage: Scheduling, cost allocation, capacity planning
 */

export interface Equipment {
  id: string;
  name: string;
  category: 'mower' | 'trimmer' | 'blower' | 'trailer' | 'truck' | 'chainsaw' | 'spreader' | 'aerator' | 'other';
  make: string;
  model: string;
  yearAcquired: number;
  purchasePrice: number;
  currentValue: number;
  status: 'active' | 'maintenance' | 'retired';
  assignedCrew?: string;
  hoursLogged: number;
  lastMaintenance: string;
  nextMaintenanceDue: string;
  maintenanceIntervalHours: number;
  fuelType: 'gas' | 'diesel' | 'electric' | 'none';
  operatingCostPerHour: number;
  requiredForServices: string[];
}

export interface MaintenanceRecord {
  equipmentId: string;
  date: string;
  type: 'preventive' | 'repair' | 'inspection';
  description: string;
  cost: number;
  partsReplaced?: string[];
  performedBy: string;
  hoursAtService: number;
  nextServiceDue: string;
}

const equipment: Equipment[] = [
  // Mowers
  {
    id: 'mower-ztr-1',
    name: 'Primary Zero-Turn',
    category: 'mower',
    make: 'Exmark',
    model: 'Lazer Z X-Series 60"',
    yearAcquired: 2024,
    purchasePrice: 14500,
    currentValue: 12000,
    status: 'active',
    assignedCrew: 'crew-a',
    hoursLogged: 450,
    lastMaintenance: '2025-11-15',
    nextMaintenanceDue: '2026-02-15',
    maintenanceIntervalHours: 100,
    fuelType: 'gas',
    operatingCostPerHour: 8.50,
    requiredForServices: ['mowing']
  },
  {
    id: 'mower-ztr-2',
    name: 'Secondary Zero-Turn',
    category: 'mower',
    make: 'Scag',
    model: 'Tiger Cat II 52"',
    yearAcquired: 2023,
    purchasePrice: 12000,
    currentValue: 9500,
    status: 'active',
    assignedCrew: 'crew-b',
    hoursLogged: 780,
    lastMaintenance: '2025-12-01',
    nextMaintenanceDue: '2026-03-01',
    maintenanceIntervalHours: 100,
    fuelType: 'gas',
    operatingCostPerHour: 7.50,
    requiredForServices: ['mowing']
  },
  {
    id: 'mower-walk-1',
    name: 'Walk-Behind Mower',
    category: 'mower',
    make: 'Honda',
    model: 'HRX217VKA 21"',
    yearAcquired: 2025,
    purchasePrice: 850,
    currentValue: 750,
    status: 'active',
    hoursLogged: 120,
    lastMaintenance: '2025-10-01',
    nextMaintenanceDue: '2026-04-01',
    maintenanceIntervalHours: 50,
    fuelType: 'gas',
    operatingCostPerHour: 3.00,
    requiredForServices: ['mowing']
  },

  // Trimmers & Edgers
  {
    id: 'trimmer-1',
    name: 'Commercial Trimmer 1',
    category: 'trimmer',
    make: 'Stihl',
    model: 'FS 131',
    yearAcquired: 2024,
    purchasePrice: 480,
    currentValue: 380,
    status: 'active',
    assignedCrew: 'crew-a',
    hoursLogged: 280,
    lastMaintenance: '2025-11-01',
    nextMaintenanceDue: '2026-02-01',
    maintenanceIntervalHours: 100,
    fuelType: 'gas',
    operatingCostPerHour: 2.50,
    requiredForServices: ['mowing', 'landscaping']
  },
  {
    id: 'trimmer-2',
    name: 'Commercial Trimmer 2',
    category: 'trimmer',
    make: 'Husqvarna',
    model: '525RJD',
    yearAcquired: 2024,
    purchasePrice: 520,
    currentValue: 420,
    status: 'active',
    assignedCrew: 'crew-b',
    hoursLogged: 195,
    lastMaintenance: '2025-10-15',
    nextMaintenanceDue: '2026-01-15',
    maintenanceIntervalHours: 100,
    fuelType: 'gas',
    operatingCostPerHour: 2.50,
    requiredForServices: ['mowing', 'landscaping']
  },

  // Blowers
  {
    id: 'blower-bp-1',
    name: 'Backpack Blower 1',
    category: 'blower',
    make: 'Stihl',
    model: 'BR 800 C-E',
    yearAcquired: 2024,
    purchasePrice: 680,
    currentValue: 550,
    status: 'active',
    assignedCrew: 'crew-a',
    hoursLogged: 320,
    lastMaintenance: '2025-11-20',
    nextMaintenanceDue: '2026-02-20',
    maintenanceIntervalHours: 100,
    fuelType: 'gas',
    operatingCostPerHour: 2.00,
    requiredForServices: ['mowing', 'leaf-removal', 'mulching']
  },
  {
    id: 'blower-bp-2',
    name: 'Backpack Blower 2',
    category: 'blower',
    make: 'Echo',
    model: 'PB-8010',
    yearAcquired: 2023,
    purchasePrice: 600,
    currentValue: 400,
    status: 'active',
    assignedCrew: 'crew-b',
    hoursLogged: 480,
    lastMaintenance: '2025-12-01',
    nextMaintenanceDue: '2026-03-01',
    maintenanceIntervalHours: 100,
    fuelType: 'gas',
    operatingCostPerHour: 2.00,
    requiredForServices: ['mowing', 'leaf-removal', 'mulching']
  },

  // Chainsaws
  {
    id: 'chainsaw-1',
    name: 'Professional Chainsaw',
    category: 'chainsaw',
    make: 'Stihl',
    model: 'MS 462 C-M 25"',
    yearAcquired: 2024,
    purchasePrice: 1200,
    currentValue: 1000,
    status: 'active',
    hoursLogged: 85,
    lastMaintenance: '2025-11-01',
    nextMaintenanceDue: '2026-02-01',
    maintenanceIntervalHours: 50,
    fuelType: 'gas',
    operatingCostPerHour: 4.00,
    requiredForServices: ['tree-trimming']
  },
  {
    id: 'chainsaw-2',
    name: 'Pole Saw',
    category: 'chainsaw',
    make: 'Stihl',
    model: 'HT 135',
    yearAcquired: 2025,
    purchasePrice: 750,
    currentValue: 700,
    status: 'active',
    hoursLogged: 45,
    lastMaintenance: '2025-12-01',
    nextMaintenanceDue: '2026-06-01',
    maintenanceIntervalHours: 50,
    fuelType: 'gas',
    operatingCostPerHour: 3.50,
    requiredForServices: ['tree-trimming']
  },

  // Specialty Equipment
  {
    id: 'aerator-1',
    name: 'Core Aerator',
    category: 'aerator',
    make: 'Ryan',
    model: 'Lawnaire V',
    yearAcquired: 2023,
    purchasePrice: 3800,
    currentValue: 2800,
    status: 'active',
    hoursLogged: 120,
    lastMaintenance: '2025-09-01',
    nextMaintenanceDue: '2026-09-01',
    maintenanceIntervalHours: 50,
    fuelType: 'gas',
    operatingCostPerHour: 15.00,
    requiredForServices: ['overseeding']
  },
  {
    id: 'spreader-1',
    name: 'Commercial Spreader',
    category: 'spreader',
    make: 'Lesco',
    model: '80lb Push Spreader',
    yearAcquired: 2024,
    purchasePrice: 350,
    currentValue: 280,
    status: 'active',
    hoursLogged: 65,
    lastMaintenance: '2025-10-01',
    nextMaintenanceDue: '2026-04-01',
    maintenanceIntervalHours: 100,
    fuelType: 'none',
    operatingCostPerHour: 0.50,
    requiredForServices: ['overseeding', 'landscaping']
  },

  // Vehicles & Trailers
  {
    id: 'truck-1',
    name: 'Primary Work Truck',
    category: 'truck',
    make: 'Ford',
    model: 'F-350 Super Duty',
    yearAcquired: 2022,
    purchasePrice: 65000,
    currentValue: 48000,
    status: 'active',
    assignedCrew: 'crew-a',
    hoursLogged: 2800,
    lastMaintenance: '2025-12-01',
    nextMaintenanceDue: '2026-03-01',
    maintenanceIntervalHours: 250,
    fuelType: 'diesel',
    operatingCostPerHour: 25.00,
    requiredForServices: ['all']
  },
  {
    id: 'truck-2',
    name: 'Secondary Work Truck',
    category: 'truck',
    make: 'Chevrolet',
    model: 'Silverado 2500HD',
    yearAcquired: 2023,
    purchasePrice: 58000,
    currentValue: 46000,
    status: 'active',
    assignedCrew: 'crew-b',
    hoursLogged: 1600,
    lastMaintenance: '2025-11-15',
    nextMaintenanceDue: '2026-02-15',
    maintenanceIntervalHours: 250,
    fuelType: 'gas',
    operatingCostPerHour: 22.00,
    requiredForServices: ['all']
  },
  {
    id: 'trailer-1',
    name: 'Equipment Trailer 1',
    category: 'trailer',
    make: 'Big Tex',
    model: '14LP-16',
    yearAcquired: 2022,
    purchasePrice: 4500,
    currentValue: 3500,
    status: 'active',
    assignedCrew: 'crew-a',
    hoursLogged: 0,
    lastMaintenance: '2025-11-01',
    nextMaintenanceDue: '2026-05-01',
    maintenanceIntervalHours: 0,
    fuelType: 'none',
    operatingCostPerHour: 0.50,
    requiredForServices: ['all']
  },
  {
    id: 'trailer-2',
    name: 'Equipment Trailer 2',
    category: 'trailer',
    make: 'Big Tex',
    model: '14LP-16',
    yearAcquired: 2023,
    purchasePrice: 4800,
    currentValue: 4000,
    status: 'active',
    assignedCrew: 'crew-b',
    hoursLogged: 0,
    lastMaintenance: '2025-10-01',
    nextMaintenanceDue: '2026-04-01',
    maintenanceIntervalHours: 0,
    fuelType: 'none',
    operatingCostPerHour: 0.50,
    requiredForServices: ['all']
  }
];

// ============================================
// EQUIPMENT REGISTRY CLASS
// ============================================

class EquipmentRegistry {
  private equipment: Equipment[];

  constructor() {
    this.equipment = equipment;
  }

  /**
   * Get all equipment
   */
  getAllEquipment(): Equipment[] {
    return this.equipment;
  }

  /**
   * Get equipment by ID
   */
  getEquipmentById(id: string): Equipment | undefined {
    return this.equipment.find(e => e.id === id);
  }

  /**
   * Get equipment by category
   */
  getEquipmentByCategory(category: Equipment['category']): Equipment[] {
    return this.equipment.filter(e => e.category === category);
  }

  /**
   * Get active equipment
   */
  getActiveEquipment(): Equipment[] {
    return this.equipment.filter(e => e.status === 'active');
  }

  /**
   * Get equipment assigned to a crew
   */
  getCrewEquipment(crewId: string): Equipment[] {
    return this.equipment.filter(e => e.assignedCrew === crewId);
  }

  /**
   * Get equipment needed for a service
   */
  getEquipmentForService(serviceId: string): Equipment[] {
    return this.equipment.filter(e =>
      e.status === 'active' &&
      (e.requiredForServices.includes(serviceId) || e.requiredForServices.includes('all'))
    );
  }

  /**
   * Get equipment due for maintenance
   */
  getMaintenanceDue(): Equipment[] {
    const today = new Date().toISOString().split('T')[0];
    return this.equipment.filter(e =>
      e.status === 'active' &&
      e.nextMaintenanceDue <= today
    );
  }

  /**
   * Get equipment needing maintenance soon (within 30 days)
   */
  getUpcomingMaintenance(): Equipment[] {
    const today = new Date();
    const thirtyDaysOut = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    return this.equipment.filter(e =>
      e.status === 'active' &&
      e.nextMaintenanceDue <= thirtyDaysOut
    );
  }

  /**
   * Calculate total fleet value
   */
  getTotalFleetValue(): number {
    return this.equipment.reduce((sum, e) => sum + e.currentValue, 0);
  }

  /**
   * Calculate average operating cost per hour
   */
  getAverageOperatingCost(): number {
    const active = this.getActiveEquipment();
    if (active.length === 0) return 0;

    const totalCost = active.reduce((sum, e) => sum + e.operatingCostPerHour, 0);
    return totalCost / active.length;
  }

  /**
   * Get fleet utilization statistics
   */
  getFleetStats(): {
    totalEquipment: number;
    activeEquipment: number;
    inMaintenance: number;
    retired: number;
    totalValue: number;
    avgAge: number;
    maintenanceDue: number;
  } {
    const currentYear = new Date().getFullYear();

    return {
      totalEquipment: this.equipment.length,
      activeEquipment: this.equipment.filter(e => e.status === 'active').length,
      inMaintenance: this.equipment.filter(e => e.status === 'maintenance').length,
      retired: this.equipment.filter(e => e.status === 'retired').length,
      totalValue: this.getTotalFleetValue(),
      avgAge: this.equipment.reduce((sum, e) => sum + (currentYear - e.yearAcquired), 0) / this.equipment.length,
      maintenanceDue: this.getMaintenanceDue().length
    };
  }

  /**
   * Check if service can be performed (equipment available)
   */
  canPerformService(serviceId: string, crewId?: string): {
    canPerform: boolean;
    availableEquipment: Equipment[];
    missingEquipment: string[];
  } {
    const required = this.getEquipmentForService(serviceId);
    const available = crewId
      ? required.filter(e => e.assignedCrew === crewId || !e.assignedCrew)
      : required.filter(e => e.status === 'active');

    return {
      canPerform: available.length > 0,
      availableEquipment: available,
      missingEquipment: available.length === 0 ? [serviceId] : []
    };
  }
}

export const equipmentRegistry = new EquipmentRegistry();
