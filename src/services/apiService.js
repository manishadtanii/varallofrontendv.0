// ============================================================================
// CENTRALIZED API SERVICE - All Backend APIs in One File
// ============================================================================

export const API_BASE_URL = 
  import.meta.env.VITE_FRONTEND_URL || 
  import.meta.env.VITE_API_BASE || 
  import.meta.env.VITE_BACKEND_URL || 
  'https://varalobackendv-0.onrender.com/api';

// export const API_BASE_URL = 'http://localhost:3000/api';

// ============================================================================
// PAGE APIs - Fetch Pages & Sections
// ============================================================================
export const pageAPI = {
  /**
   * Get all pages
   */
  getPages: async () => {
    try {
      console.log('📄 Fetching all pages from backend...');
      const response = await fetch(`${API_BASE_URL}/pages/`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      console.log('📄 All pages fetched:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching pages:', error);
      throw error;
    }
  },

  /**
   * Get single page by slug with all sections
   * @param {string} slug - Page slug (e.g., 'home', 'about', 'contact')
   */
  getPageBySlug: async (slug) => {
    try {
      console.log(`📄 Fetching page with slug: ${slug} from backend...`);
      const response = await fetch(`${API_BASE_URL}/pages/${slug}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      console.log(`📄 Page fetched:`, data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching page by slug:', error);
      throw error;
    }
  },

  /**
   * Get service page by slug (e.g., tvg-management, tvg-stream)
   * @param {string} slug - Service slug
   */
  getServiceBySlug: async (slug) => {
    try {
      console.log(`📄 Fetching service with slug: ${slug}...`);
      const response = await fetch(`${API_BASE_URL}/pages/services/${slug}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      console.log(`📄 Service page fetched:`, data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching service page:', error);
      throw error;
    }
  },
};

// ============================================================================
// SECTION APIs - Update Section Content (with optional image)
// ============================================================================
export const sectionAPI = {
  /**
   * Update section content with optional image upload
   * @param {string} pageSlug - Page slug (e.g., 'home', 'about')
   * @param {string} sectionKey - Section key (e.g., 'hero', 'experience', 'testimonials')
   * @param {object} contentData - Section content data
   * @param {File} imageFile - Optional image file to upload
   * @param {string} imageFieldPath - Optional path to image field (e.g., 'image.url' or 'hero.bgImage.url')
   */
  updateSection: async (pageSlug, sectionKey, contentData, imageFile = null, imageFieldPath = null) => {
    try {
      console.log(`🔧 Updating section: ${pageSlug}/${sectionKey}`);

      const formData = new FormData();

      // Add content data as JSON strings
      for (const [key, value] of Object.entries(contentData)) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }

      // Add image field path if provided
      if (imageFieldPath) {
        formData.append('imageFieldPath', imageFieldPath);
      }

      // Add image file if provided
      if (imageFile) {
        formData.append('imageFile', imageFile);
        console.log(`📸 Image attached: ${imageFile.name}`);
      }

      const response = await fetch(
        `${API_BASE_URL}/pages/sections/${pageSlug}/${sectionKey}`,
        {
          method: 'PATCH',
          credentials: 'include',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update section');
      }

      console.log('✅ Section updated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating section:', error);
      throw error;
    }
  },
};

// ============================================================================
// UPLOAD APIs - Image Upload, Multiple Upload, Delete
// ============================================================================
export const uploadAPI = {
  /**
   * Upload single image and get URL
   * @param {File} imageFile - Image file to upload
   * @param {string} sectionKey - Section key (optional)
   * @param {string} pageSlug - Page slug (optional, default: 'home')
   * @param {string} folder - Custom Cloudinary folder (optional)
   */
  uploadImage: async (imageFile, sectionKey = '', pageSlug = 'home', folder = null) => {
    try {
      console.log(`📤 Uploading image: ${imageFile.name}`);

      const formData = new FormData();
      formData.append('image', imageFile);
      if (sectionKey) formData.append('sectionKey', sectionKey);
      formData.append('pageSlug', pageSlug);
      if (folder) formData.append('folder', folder);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      console.log('✅ Image uploaded:', data.url);
      return data;
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      throw error;
    }
  },

  /**
   * Upload image and update section in database
   * @param {File} imageFile - Image file to upload
   * @param {string} sectionKey - Section key (required)
   * @param {string} pageSlug - Page slug (optional, default: 'home')
   */
  uploadSectionImage: async (imageFile, sectionKey, pageSlug = 'home') => {
    try {
      console.log(`📤 Uploading and updating section image: ${imageFile.name}`);

      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('sectionKey', sectionKey);
      formData.append('pageSlug', pageSlug);

      const response = await fetch(`${API_BASE_URL}/upload/section`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      console.log('✅ Section image uploaded and updated:', data.url);
      return data;
    } catch (error) {
      console.error('❌ Error uploading section image:', error);
      throw error;
    }
  },

  /**
   * Upload multiple images at once
   * @param {FileList|File[]} imageFiles - Multiple image files
   * @param {string} sectionKey - Section key (required)
   * @param {string} pageSlug - Page slug (optional, default: 'home')
   */
  uploadMultipleImages: async (imageFiles, sectionKey, pageSlug = 'home') => {
    try {
      console.log(`📤 Uploading ${imageFiles.length} images...`);

      const formData = new FormData();
      for (const file of imageFiles) {
        formData.append('images', file);
      }
      formData.append('sectionKey', sectionKey);
      formData.append('pageSlug', pageSlug);

      const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      console.log(`✅ ${data.images.length} images uploaded`);
      return data;
    } catch (error) {
      console.error('❌ Error uploading multiple images:', error);
      throw error;
    }
  },

  /**
   * Delete image from Cloudinary
   * @param {string} publicId - Cloudinary public ID of image
   */
  deleteImage: async (publicId) => {
    try {
      console.log(`🗑️ Deleting image: ${publicId}`);

      const response = await fetch(`${API_BASE_URL}/upload/${publicId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Delete failed');
      }

      console.log('✅ Image deleted successfully');
      return data;
    } catch (error) {
      console.error('❌ Error deleting image:', error);
      throw error;
    }
  },

  /**
   * Get all images from Cloudinary (Media Library)
   */
  getMediaLibrary: async () => {
    try {
      console.log('📚 Fetching media library from Cloudinary...');
      
      const response = await fetch(`${API_BASE_URL}/upload/media/library`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch media library');
      }

      console.log('✅ Media library fetched:', data.totalImages);
      return data;
    } catch (error) {
      console.error('❌ Error fetching media library:', error);
      throw error;
    }
  },
};

// ============================================================================
// CONTACT APIs - Submit Contact Form, Get Submissions
// ============================================================================
export const contactAPI = {
  /**
   * Submit contact form
   * @param {object} contactData - Form data
   * @param {File} file - Optional file attachment
   */
  submitContact: async (contactData, file = null) => {
    try {
      console.log('📮 Submitting contact form...');

      const formData = new FormData();

      // Add form fields
      for (const [key, value] of Object.entries(contactData)) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value || '');
        }
      }

      // Add file if provided
      if (file) {
        formData.append('File', file);
      }

      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit contact form');
      }

      console.log('✅ Contact form submitted:', data);
      return data;
    } catch (error) {
      console.error('❌ Error submitting contact form:', error);
      throw error;
    }
  },

  /**
   * Get all contact submissions
   */
  getContacts: async (page = 1, limit = 50) => {
    try {
      console.log('📋 Fetching contact submissions...');

      const response = await fetch(`${API_BASE_URL}/contacts?page=${page}&limit=${limit}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch contacts');
      }

      console.log('✅ Contacts fetched:', data.data.total);
      return data;
    } catch (error) {
      console.error('❌ Error fetching contacts:', error);
      throw error;
    }
  },

  /**
   * Get single contact by ID
   */
  getContactById: async (id) => {
    try {
      console.log(`📋 Fetching contact ${id}...`);

      const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch contact');
      }

      return data;
    } catch (error) {
      console.error('❌ Error fetching contact:', error);
      throw error;
    }
  },

  /**
   * Delete contact submission
   */
  deleteContact: async (id) => {
    try {
      console.log(`🗑️ Deleting contact ${id}...`);

      const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete contact');
      }

      console.log('✅ Contact deleted');
      return data;
    } catch (error) {
      console.error('❌ Error deleting contact:', error);
      throw error;
    }
  },
};

// ============================================================================
// AUTH APIs - Get Users
// ============================================================================
export const authAPI = {
  /**
   * Get all users (admin only)
   */
  getUsers: async () => {
    try {
      console.log('👥 Fetching users...');

      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      console.log('✅ Users fetched:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    try {
      console.log('👤 Fetching current user...');

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user');
      }

      return data;
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      throw error;
    }
  },
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================
export default {
  pageAPI,
  sectionAPI,
  uploadAPI,
  contactAPI,
  authAPI,
};
