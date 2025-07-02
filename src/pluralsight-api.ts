import axios, { AxiosInstance } from 'axios';

export interface PluralsightConfig {
  apiKey: string;
  baseUrl: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  authors: string[];
  skillPaths: string[];
  tags: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: Course[];
  estimatedTime: string;
  skillLevel: string;
}

export interface UserProgress {
  courseId: string;
  progress: number;
  completedDate?: string;
  timeSpent: number;
}

export class PluralsightAPI {
  private client: AxiosInstance;

  constructor(config: PluralsightConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async searchCourses(query: string, filters?: {
    level?: string;
    skillPath?: string;
    tag?: string;
  }): Promise<Course[]> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      if (filters?.level) params.append('level', filters.level);
      if (filters?.skillPath) params.append('skillPath', filters.skillPath);
      if (filters?.tag) params.append('tag', filters.tag);

      const response = await this.client.get(`/courses/search?${params.toString()}`);
      return response.data.courses || [];
    } catch (error) {
      console.error('Error searching courses:', error);
      // Return mock data for demonstration since we don't have real API access
      return this.getMockCourses().filter(course => 
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  async getCourse(courseId: string): Promise<Course | null> {
    try {
      const response = await this.client.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      // Return mock data for demonstration
      return this.getMockCourses().find(course => course.id === courseId) || null;
    }
  }

  async getLearningPaths(): Promise<LearningPath[]> {
    try {
      const response = await this.client.get('/learning-paths');
      return response.data.learningPaths || [];
    } catch (error) {
      console.error('Error fetching learning paths:', error);
      // Return mock data for demonstration
      return this.getMockLearningPaths();
    }
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    try {
      const response = await this.client.get(`/users/${userId}/progress`);
      return response.data.progress || [];
    } catch (error) {
      console.error('Error fetching user progress:', error);
      // Return mock data for demonstration
      return this.getMockUserProgress();
    }
  }

  async getSkillAssessment(skillName: string): Promise<any> {
    try {
      const response = await this.client.get(`/skills/${skillName}/assessment`);
      return response.data;
    } catch (error) {
      console.error('Error fetching skill assessment:', error);
      // Return mock data for demonstration
      return {
        skillName,
        currentLevel: 'Intermediate',
        recommendedCourses: this.getMockCourses().slice(0, 3),
        assessmentUrl: `https://app.pluralsight.com/skills/${skillName}/assessment`
      };
    }
  }

  private getMockCourses(): Course[] {
    return [
      {
        id: 'react-fundamentals',
        title: 'React Fundamentals',
        description: 'Learn the basics of React development including components, props, and state management.',
        level: 'Beginner',
        duration: '4h 30m',
        authors: ['John Doe'],
        skillPaths: ['React', 'Frontend Development'],
        tags: ['react', 'javascript', 'frontend']
      },
      {
        id: 'advanced-typescript',
        title: 'Advanced TypeScript',
        description: 'Master advanced TypeScript concepts including generics, decorators, and advanced types.',
        level: 'Advanced',
        duration: '6h 15m',
        authors: ['Jane Smith'],
        skillPaths: ['TypeScript', 'JavaScript'],
        tags: ['typescript', 'javascript', 'types']
      },
      {
        id: 'docker-containerization',
        title: 'Docker Containerization',
        description: 'Learn how to containerize applications using Docker and manage container orchestration.',
        level: 'Intermediate',
        duration: '5h 20m',
        authors: ['Mike Johnson'],
        skillPaths: ['DevOps', 'Cloud Computing'],
        tags: ['docker', 'containers', 'devops']
      }
    ];
  }

  private getMockLearningPaths(): LearningPath[] {
    return [
      {
        id: 'frontend-developer',
        title: 'Frontend Developer Path',
        description: 'Complete path to become a professional frontend developer',
        courses: this.getMockCourses().slice(0, 2),
        estimatedTime: '40 hours',
        skillLevel: 'Beginner to Advanced'
      }
    ];
  }

  private getMockUserProgress(): UserProgress[] {
    return [
      {
        courseId: 'react-fundamentals',
        progress: 75,
        timeSpent: 180, // minutes
      },
      {
        courseId: 'advanced-typescript',
        progress: 100,
        completedDate: '2024-01-15',
        timeSpent: 375, // minutes
      }
    ];
  }
}