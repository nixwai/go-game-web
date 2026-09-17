<script setup lang="ts">
import PasswordChangeForm from './components/password-change-form.vue';
import UserInfoCard from './components/user-info-card.vue';

defineOptions({ name: 'ProfileView' });
</script>

<template>
  <div class="profile-view px-6 pt-4.5 pb-10.5">
    <section class="profile-shell w-settings-shell px-13 pt-11 pb-13 mx-auto bg-mc-paper-50/90 border border-mc-paper-0/76 rounded-6xl shadow-shell" aria-labelledby="profile-title">
      <div class="profile-header flex items-end justify-between gap-6 mb-7.5">
        <div>
          <p class="m-0 mb-2 text-xs font-[800] text-mc-sage-600 tracking-[0.15em]">
            ACCOUNT SECURITY
          </p>
          <h1 id="profile-title" class="m-0 text-2xl font-bold text-mc-ink-950">
            用户信息管理
          </h1>
        </div>
        <span class="grid place-items-center w-10 h-10 text-2xl text-mc-sage-600 bg-mc-sage-100 rounded-2xl" aria-hidden="true">✦</span>
      </div>

      <div class="profile-layout grid grid-cols-[minmax(0,1fr)_380px] gap-5.5 items-start">
        <UserInfoCard />
        <PasswordChangeForm />
      </div>
    </section>
  </div>
</template>
