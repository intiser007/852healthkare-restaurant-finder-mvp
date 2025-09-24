<template>
  <q-app>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated class="modern-header">
        <q-toolbar class="q-px-lg">
          <div class="row items-center no-wrap">
            <div class="header-logo">
              <q-icon name="restaurant_menu" size="28px" class="q-mr-sm" />
              <div class="header-text">
                <div class="header-title">HealthKare</div>
                <div class="header-subtitle">Smart Restaurant Finder</div>
              </div>
            </div>
          </div>
          
          <q-space />
          
          <div class="header-actions">
            <q-btn
              flat
              round
              icon="info"
              color="white"
              size="md"
              class="q-mr-sm"
            >
              <q-tooltip>About HealthKare</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              icon="settings"
              color="white"
              size="md"
            >
              <q-tooltip>Settings</q-tooltip>
            </q-btn>
          </div>
        </q-toolbar>
      </q-header>

      <q-page-container class="page-container">
        <RestaurantFinderPage />
      </q-page-container>
    </q-layout>
  </q-app>
</template>

<script setup lang="ts">
import RestaurantFinderPage from './components/RestaurantFinderPage.vue'
</script>

<style>
/* Modern Header Styles */
.modern-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-logo {
  display: flex;
  align-items: center;
}

.header-text {
  margin-left: 8px;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  line-height: 1;
}

.header-actions {
  display: flex;
  align-items: center;
}

/* Page Container */
.page-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 64px);
}

/* Global Animations */
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

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}
</style>
