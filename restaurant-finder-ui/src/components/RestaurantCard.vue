<template>
  <q-card class="restaurant-card" flat>
    <!-- Card Header with Restaurant Info -->
    <div class="card-header">
      <div class="restaurant-info">
        <div class="restaurant-name">{{ restaurant.name }}</div>
        <div class="restaurant-cuisine">{{ restaurant.cuisine }}</div>
      </div>
      <div class="cuisine-badge">
        <q-icon name="restaurant_menu" size="sm" class="q-mr-xs" />
        {{ restaurant.cuisine.split(',')[0] }}
      </div>
    </div>

    <!-- Card Body -->
    <q-card-section class="card-body">
      <!-- Location -->
      <div class="info-section">
        <div class="info-label">
          <q-icon name="place" color="primary" size="sm" class="q-mr-xs" />
          Location
        </div>
        <div class="info-content">{{ restaurant.address }}</div>
      </div>
      
      <!-- Why This Restaurant -->
      <div class="info-section">
        <div class="info-label">
          <q-icon name="psychology" color="positive" size="sm" class="q-mr-xs" />
          Why this restaurant?
        </div>
        <div class="info-content justification-text">{{ restaurant.justification }}</div>
      </div>

      <!-- Suggested Dish -->
      <div class="info-section highlight-section">
        <div class="info-label">
          <q-icon name="recommend" color="primary" size="sm" class="q-mr-xs" />
          Recommended Dish
        </div>
        <div class="suggested-dish">{{ restaurant.suggestedDish }}</div>
      </div>
    </q-card-section>

    <!-- Card Actions -->
    <q-card-actions class="card-actions">
      <q-btn
        color="primary"
        icon="directions"
        label="Directions"
        @click="openDirections"
        class="action-button"
        rounded
        unelevated
      />
      <q-btn
        color="secondary"
        icon="phone"
        label="Call"
        @click="callRestaurant"
        class="action-button"
        rounded
        outline
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { RestaurantSuggestion } from '@/types';

interface Props {
  restaurant: RestaurantSuggestion;
}

const props = defineProps<Props>();

const openDirections = () => {
  const query = encodeURIComponent(props.restaurant.address);
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  window.open(url, '_blank');
};

const callRestaurant = () => {
  // In a real app, you'd have phone numbers from the API
  // For now, we'll show a message
  alert('Phone number not available. Please look up the restaurant online.');
};
</script>

<style scoped>
/* Modern Restaurant Card */
.restaurant-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.restaurant-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.restaurant-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* Card Header */
.card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.restaurant-info {
  flex: 1;
}

.restaurant-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.restaurant-cuisine {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
}

.cuisine-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

/* Card Body */
.card-body {
  padding: 1.5rem;
}

.info-section {
  margin-bottom: 1.5rem;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-label {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.info-content {
  color: #5a6c7d;
  line-height: 1.5;
  font-size: 0.95rem;
}

.justification-text {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  font-style: italic;
}

.highlight-section {
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.suggested-dish {
  font-size: 1.1rem;
  font-weight: 600;
  color: #667eea;
  line-height: 1.4;
  padding: 0.75rem;
  background: white;
  border-radius: 12px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  text-align: center;
}

/* Card Actions */
.card-actions {
  background: #f8f9fa;
  padding: 1rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.action-button {
  font-weight: 600;
  text-transform: none;
  padding: 0.5rem 1.25rem;
  transition: all 0.3s ease;
}

.action-button:hover {
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .cuisine-badge {
    align-self: flex-start;
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
  }
}

/* Animation for card entrance */
.restaurant-card {
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

/* Hover effects for interactive elements */
.action-button:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cuisine-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Focus states for accessibility */
.action-button:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Loading state animation */
.restaurant-card.loading {
  opacity: 0.7;
  pointer-events: none;
}

.restaurant-card.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
</style>
