<template>
  <q-page class="modern-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <q-icon name="restaurant_menu" size="64px" color="white" />
        </div>
        <h1 class="hero-title">Find Your Perfect Restaurant</h1>
        <p class="hero-subtitle">
          Get personalized restaurant recommendations based on your health profile and location
        </p>
        <div class="hero-features">
          <div class="feature-item">
            <q-icon name="favorite" color="white" size="sm" class="q-mr-xs" />
            <span>Health-Focused</span>
          </div>
          <div class="feature-item">
            <q-icon name="location_on" color="white" size="sm" class="q-mr-xs" />
            <span>Location-Based</span>
          </div>
          <div class="feature-item">
            <q-icon name="psychology" color="white" size="sm" class="q-mr-xs" />
            <span>AI-Powered</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="content-container">
        <!-- Search Section -->
        <div class="search-section">
          <div class="search-card">
            <div class="search-header">
              <q-icon name="search" size="24px" color="primary" class="q-mr-sm" />
              <h3 class="search-title">Discover Restaurants</h3>
            </div>
            <p class="search-description">
              Click the button below to find restaurants near your current location that match your health goals and dietary preferences.
            </p>
            
            <div class="search-button-container">
              <q-btn
                size="xl"
                color="primary"
                icon="location_on"
                label="Find Restaurants Near Me"
                @click="handleFindRestaurants"
                :loading="isLoading"
                :disable="isLoading"
                class="search-button"
                rounded
                unelevated
              >
                <template v-slot:loading>
                  <q-spinner-dots class="on-left" />
                  Finding restaurants...
                </template>
              </q-btn>
            </div>
          </div>
        </div>

        <!-- Error Banner -->
        <transition name="fade">
          <q-banner
            v-if="error"
            class="error-banner"
            dense
            rounded
          >
            <template v-slot:avatar>
              <q-icon name="error" color="white" />
            </template>
            <div class="error-content">
              <div class="error-title">Oops! Something went wrong</div>
              <div class="error-message">{{ error }}</div>
            </div>
            <template v-slot:action>
              <q-btn flat color="white" label="Dismiss" @click="error = null" />
            </template>
          </q-banner>
        </transition>

        <!-- Loading State -->
        <transition name="fade">
          <div v-if="isLoading" class="loading-section">
            <div class="loading-card">
              <div class="loading-content">
                <q-spinner-dots size="60px" color="primary" />
                <h3 class="loading-title">Finding the best restaurants for you...</h3>
                <p class="loading-description">
                  We're analyzing your health profile and searching for restaurants that match your preferences
                </p>
                <div class="loading-steps">
                  <div class="step-item">
                    <q-icon name="location_on" color="positive" size="sm" class="q-mr-sm" />
                    <span>Getting your location</span>
                  </div>
                  <div class="step-item">
                    <q-icon name="search" color="positive" size="sm" class="q-mr-sm" />
                    <span>Searching nearby restaurants</span>
                  </div>
                  <div class="step-item">
                    <q-icon name="psychology" color="positive" size="sm" class="q-mr-sm" />
                    <span>Analyzing your preferences</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Restaurant Suggestions -->
        <transition name="slide-up">
          <div v-if="suggestions.length > 0 && !isLoading" class="results-section">
            <div class="results-header">
              <h2 class="results-title">
                <q-icon name="recommend" color="primary" size="md" class="q-mr-sm" />
                Recommended for You
              </h2>
              <p class="results-subtitle">
                We found {{ suggestions.length }} restaurant{{ suggestions.length > 1 ? 's' : '' }} that match your health goals
              </p>
            </div>
            
            <div class="restaurants-grid">
              <div
                v-for="(restaurant, index) in suggestions"
                :key="index"
                class="restaurant-item"
                :style="{ 'animation-delay': `${index * 0.1}s` }"
              >
                <RestaurantCard :restaurant="restaurant" />
              </div>
            </div>
          </div>
        </transition>

        <!-- No Results -->
        <transition name="fade">
          <div
            v-if="suggestions.length === 0 && !isLoading && hasSearched"
            class="no-results-section"
          >
            <div class="no-results-card">
              <q-icon name="search_off" size="80px" color="grey-5" />
              <h3 class="no-results-title">No restaurants found</h3>
              <p class="no-results-description">
                We couldn't find any restaurants in your area that match your preferences. 
                Try again later or check if location services are enabled.
              </p>
              <q-btn
                color="primary"
                label="Try Again"
                icon="refresh"
                @click="handleFindRestaurants"
                rounded
                unelevated
              />
            </div>
          </div>
        </transition>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { getSuggestions } from '@/services/api';
import { getCurrentLocation } from '@/services/location';
import { RestaurantSuggestion } from '@/types';
import RestaurantCard from './RestaurantCard.vue';

const $q = useQuasar();

const isLoading = ref(false);
const error = ref<string | null>(null);
const suggestions = ref<RestaurantSuggestion[]>([]);
const hasSearched = ref(false);

const handleFindRestaurants = async () => {
  isLoading.value = true;
  error.value = null;
  suggestions.value = [];

  try {
    // Get user's current location
    const location = await getCurrentLocation();
    
    // Fetch restaurant suggestions from API
    const restaurantSuggestions = await getSuggestions(location);
    
    suggestions.value = restaurantSuggestions;
    hasSearched.value = true;

    if (restaurantSuggestions.length === 0) {
      $q.notify({
        type: 'info',
        message: 'No restaurants found in your area. Try again later.',
        position: 'top'
      });
    } else {
      $q.notify({
        type: 'positive',
        message: `Found ${restaurantSuggestions.length} restaurant recommendations!`,
        position: 'top'
      });
    }

  } catch (err) {
    console.error('Error finding restaurants:', err);
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred';
    
    $q.notify({
      type: 'negative',
      message: error.value,
      position: 'top',
      timeout: 5000
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Modern Page Layout */
.modern-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4rem 2rem;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero-icon {
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Main Content */
.main-content {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 60vh;
  padding: 2rem 0;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Search Section */
.search-section {
  margin-bottom: 2rem;
}

.search-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.search-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.search-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.search-description {
  color: #7f8c8d;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.search-button-container {
  text-align: center;
}

.search-button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
}

/* Error Banner */
.error-banner {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 20px rgba(231, 76, 60, 0.3);
}

.error-content {
  color: white;
}

.error-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.error-message {
  opacity: 0.9;
}

/* Loading Section */
.loading-section {
  margin: 2rem 0;
}

.loading-card {
  background: white;
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.loading-content {
  max-width: 500px;
  margin: 0 auto;
}

.loading-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 1.5rem 0 1rem;
}

.loading-description {
  color: #7f8c8d;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.loading-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.step-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 10px;
  color: #2c3e50;
  font-weight: 500;
}

/* Results Section */
.results-section {
  margin-top: 2rem;
}

.results-header {
  text-align: center;
  margin-bottom: 2rem;
}

.results-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.results-subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.restaurant-item {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* No Results Section */
.no-results-section {
  margin: 2rem 0;
}

.no-results-card {
  background: white;
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.no-results-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 1rem 0;
}

.no-results-description {
  color: #7f8c8d;
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-features {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .restaurants-grid {
    grid-template-columns: 1fr;
  }
  
  .search-card {
    padding: 1.5rem;
  }
  
  .loading-card {
    padding: 2rem 1rem;
  }
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.4s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
