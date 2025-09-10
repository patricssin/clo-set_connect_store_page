import { ContentItem } from '../types';

const API_BASE = 'https://closet-recruiting-api.azurewebsites.net/api/data';

export const api = {
  async getContentList(): Promise<ContentItem[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  }
};