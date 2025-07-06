import axios, { AxiosInstance } from 'axios';

export interface ChildrenApiConfig {
  apiKey: string;
  baseUrl: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  children: Child[];
}

export interface Child {
  id: string;
  name: string;
  age: number;
  parentId: string;
  ageCategory: AgeCategory;
  registrationDate: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  ageCategory: AgeCategory;
  duration: number; // in minutes
  type: ActivityType;
  requirements: string[];
}

export interface Session {
  id: string;
  childId: string;
  activityId: string;
  startTime: string;
  endTime?: string;
  status: SessionStatus;
  notes?: string;
  parentId: string;
}

export enum AgeCategory {
  AGES_5_6 = '5-6',
  AGES_7_8 = '7-8',
  AGES_9_10 = '9-10'
}

export enum ActivityType {
  RUNNING = 'running',
  SPORTS = 'sports',
  GAMES = 'games',
  EXERCISE = 'exercise'
}

export enum SessionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export class ChildrenAPI {
  private client: AxiosInstance;

  constructor(config: ChildrenApiConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async registerParent(parentData: Omit<Parent, 'id' | 'registrationDate' | 'children'>): Promise<Parent> {
    try {
      const response = await this.client.post('/parents', parentData);
      return response.data;
    } catch (error) {
      console.error('Error registering parent:', error);
      // Return mock data for demonstration
      return this.createMockParent(parentData);
    }
  }

  async registerChild(childData: Omit<Child, 'id' | 'registrationDate' | 'ageCategory' | 'activities'>): Promise<Child> {
    try {
      const response = await this.client.post('/children', childData);
      return response.data;
    } catch (error) {
      console.error('Error registering child:', error);
      // Return mock data for demonstration
      return this.createMockChild(childData);
    }
  }

  async getParentById(parentId: string): Promise<Parent | null> {
    try {
      const response = await this.client.get(`/parents/${parentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching parent:', error);
      return this.getMockParents().find(parent => parent.id === parentId) || null;
    }
  }

  async getChildById(childId: string): Promise<Child | null> {
    try {
      const response = await this.client.get(`/children/${childId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching child:', error);
      return this.getMockChildren().find(child => child.id === childId) || null;
    }
  }

  async getActivitiesByAgeCategory(ageCategory: AgeCategory): Promise<Activity[]> {
    try {
      const response = await this.client.get(`/activities?ageCategory=${ageCategory}`);
      return response.data.activities || [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      return this.getMockActivities().filter(activity => activity.ageCategory === ageCategory);
    }
  }

  async getAllActivities(): Promise<Activity[]> {
    try {
      const response = await this.client.get('/activities');
      return response.data.activities || [];
    } catch (error) {
      console.error('Error fetching all activities:', error);
      return this.getMockActivities();
    }
  }

  async startSession(childId: string, activityId: string): Promise<Session> {
    try {
      const response = await this.client.post('/sessions', {
        childId,
        activityId,
        startTime: new Date().toISOString(),
        status: SessionStatus.ACTIVE
      });
      return response.data;
    } catch (error) {
      console.error('Error starting session:', error);
      return this.createMockSession(childId, activityId);
    }
  }

  async endSession(sessionId: string, notes?: string): Promise<Session> {
    try {
      const response = await this.client.patch(`/sessions/${sessionId}`, {
        endTime: new Date().toISOString(),
        status: SessionStatus.COMPLETED,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error ending session:', error);
      return this.updateMockSession(sessionId, notes);
    }
  }

  async getChildSessions(childId: string): Promise<Session[]> {
    try {
      const response = await this.client.get(`/children/${childId}/sessions`);
      return response.data.sessions || [];
    } catch (error) {
      console.error('Error fetching child sessions:', error);
      return this.getMockSessions().filter(session => session.childId === childId);
    }
  }

  async getParentChildren(parentId: string): Promise<Child[]> {
    try {
      const response = await this.client.get(`/parents/${parentId}/children`);
      return response.data.children || [];
    } catch (error) {
      console.error('Error fetching parent children:', error);
      return this.getMockChildren().filter(child => child.parentId === parentId);
    }
  }

  private createMockParent(parentData: Omit<Parent, 'id' | 'registrationDate' | 'children'>): Parent {
    return {
      id: `parent-${Date.now()}`,
      ...parentData,
      registrationDate: new Date().toISOString(),
      children: []
    };
  }

  private createMockChild(childData: Omit<Child, 'id' | 'registrationDate' | 'ageCategory' | 'activities'>): Child {
    const ageCategory = this.getAgeCategoryForAge(childData.age);
    return {
      id: `child-${Date.now()}`,
      ...childData,
      registrationDate: new Date().toISOString(),
      ageCategory,
      activities: []
    };
  }

  private createMockSession(childId: string, activityId: string): Session {
    const child = this.getMockChildren().find(c => c.id === childId);
    return {
      id: `session-${Date.now()}`,
      childId,
      activityId,
      startTime: new Date().toISOString(),
      status: SessionStatus.ACTIVE,
      parentId: child?.parentId || 'unknown'
    };
  }

  private updateMockSession(sessionId: string, notes?: string): Session {
    // In a real implementation, this would update the session in the database
    // For now, we'll create a mock updated session
    return {
      id: sessionId,
      childId: 'mock-child-id',
      activityId: 'mock-activity-id',
      startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      endTime: new Date().toISOString(),
      status: SessionStatus.COMPLETED,
      notes: notes || 'Session completed',
      parentId: 'mock-parent-id'
    };
  }

  private getAgeCategoryForAge(age: number): AgeCategory {
    if (age >= 5 && age <= 6) return AgeCategory.AGES_5_6;
    if (age >= 7 && age <= 8) return AgeCategory.AGES_7_8;
    if (age >= 9 && age <= 10) return AgeCategory.AGES_9_10;
    throw new Error(`Age ${age} is not supported. Supported ages: 5-10`);
  }

  private getMockParents(): Parent[] {
    return [
      {
        id: 'parent-1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1234567890',
        registrationDate: '2024-01-15T10:00:00Z',
        children: []
      },
      {
        id: 'parent-2',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1987654321',
        registrationDate: '2024-01-20T14:30:00Z',
        children: []
      }
    ];
  }

  private getMockChildren(): Child[] {
    return [
      {
        id: 'child-1',
        name: 'Emma Smith',
        age: 6,
        parentId: 'parent-1',
        ageCategory: AgeCategory.AGES_5_6,
        registrationDate: '2024-01-15T10:15:00Z',
        activities: []
      },
      {
        id: 'child-2',
        name: 'Oliver Johnson',
        age: 8,
        parentId: 'parent-2',
        ageCategory: AgeCategory.AGES_7_8,
        registrationDate: '2024-01-20T14:45:00Z',
        activities: []
      },
      {
        id: 'child-3',
        name: 'Sophia Smith',
        age: 9,
        parentId: 'parent-1',
        ageCategory: AgeCategory.AGES_9_10,
        registrationDate: '2024-01-22T09:00:00Z',
        activities: []
      }
    ];
  }

  private getMockActivities(): Activity[] {
    return [
      {
        id: 'activity-1',
        name: 'Fun Run',
        description: 'A fun running activity for young children with games and obstacles',
        ageCategory: AgeCategory.AGES_5_6,
        duration: 20,
        type: ActivityType.RUNNING,
        requirements: ['Comfortable shoes', 'Water bottle']
      },
      {
        id: 'activity-2',
        name: 'Sprint Training',
        description: 'Basic sprint training with focus on technique and fun',
        ageCategory: AgeCategory.AGES_7_8,
        duration: 30,
        type: ActivityType.RUNNING,
        requirements: ['Running shoes', 'Sports clothing', 'Water bottle']
      },
      {
        id: 'activity-3',
        name: 'Endurance Building',
        description: 'Age-appropriate endurance activities with tracking progress',
        ageCategory: AgeCategory.AGES_9_10,
        duration: 40,
        type: ActivityType.RUNNING,
        requirements: ['Running shoes', 'Sports clothing', 'Water bottle', 'Towel']
      },
      {
        id: 'activity-4',
        name: 'Playground Games',
        description: 'Active games and play activities for younger children',
        ageCategory: AgeCategory.AGES_5_6,
        duration: 25,
        type: ActivityType.GAMES,
        requirements: ['Comfortable clothing', 'Water bottle']
      },
      {
        id: 'activity-5',
        name: 'Team Sports',
        description: 'Introduction to team sports like soccer, basketball basics',
        ageCategory: AgeCategory.AGES_7_8,
        duration: 35,
        type: ActivityType.SPORTS,
        requirements: ['Sports shoes', 'Sports clothing', 'Water bottle']
      },
      {
        id: 'activity-6',
        name: 'Competitive Games',
        description: 'More structured competitive activities and skill development',
        ageCategory: AgeCategory.AGES_9_10,
        duration: 45,
        type: ActivityType.SPORTS,
        requirements: ['Sports equipment', 'Sports clothing', 'Water bottle', 'Towel']
      }
    ];
  }

  private getMockSessions(): Session[] {
    return [
      {
        id: 'session-1',
        childId: 'child-1',
        activityId: 'activity-1',
        startTime: '2024-01-25T10:00:00Z',
        endTime: '2024-01-25T10:20:00Z',
        status: SessionStatus.COMPLETED,
        notes: 'Great participation, enjoyed the obstacle course!',
        parentId: 'parent-1'
      },
      {
        id: 'session-2',
        childId: 'child-2',
        activityId: 'activity-2',
        startTime: '2024-01-25T11:00:00Z',
        status: SessionStatus.ACTIVE,
        parentId: 'parent-2'
      }
    ];
  }
}