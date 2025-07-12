'use client';

import React, { useState } from 'react';
import { TargetingOptions, DeviceType, TrafficSource, TimeSchedule, FrequencyCap } from '@/types';

interface TargetingOptionsProps {
  value: TargetingOptions;
  onChange: (options: TargetingOptions) => void;
  className?: string;
}

export function TargetingOptionsComponent({ value, onChange, className = '' }: TargetingOptionsProps) {
  const [activeTab, setActiveTab] = useState<'devices' | 'location' | 'schedule' | 'frequency'>('devices');

  const handleDevicesChange = (devices: DeviceType[]) => {
    onChange({ ...value, devices });
  };

  const handleLocationsChange = (locations: string[]) => {
    onChange({ ...value, locations });
  };

  const handleLanguagesChange = (languages: string[]) => {
    onChange({ ...value, languages });
  };

  const handleTrafficSourcesChange = (sources: TrafficSource[]) => {
    onChange({ ...value, traffic_sources: sources });
  };

  const handleTimeScheduleChange = (schedule: TimeSchedule) => {
    onChange({ ...value, time_schedule: schedule });
  };

  const handleFrequencyCapChange = (cap: FrequencyCap) => {
    onChange({ ...value, frequency_cap: cap });
  };

  return (
    <div className={`bg-dark-card rounded-xl border border-gray-700 ${className}`}>
      {/* تبويبات */}
      <div className="flex border-b border-gray-700 overflow-x-auto">
        {[
          { key: 'devices', label: 'الأجهزة', icon: '📱' },
          { key: 'location', label: 'الموقع واللغة', icon: '🌍' },
          { key: 'schedule', label: 'الجدولة', icon: '⏰' },
          { key: 'frequency', label: 'التكرار', icon: '🔄' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.key
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-dark-text-secondary hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* تبويب الأجهزة */}
        {activeTab === 'devices' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">استهداف الأجهزة</h3>
              <DeviceTargeting
                selectedDevices={value.devices || ['all']}
                onChange={handleDevicesChange}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">مصادر الزيارات</h3>
              <TrafficSourceTargeting
                selectedSources={value.traffic_sources || []}
                onChange={handleTrafficSourcesChange}
              />
            </div>
          </div>
        )}

        {/* تبويب الموقع واللغة */}
        {activeTab === 'location' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">استهداف الموقع الجغرافي</h3>
              <LocationTargeting
                selectedLocations={value.locations || []}
                onChange={handleLocationsChange}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">استهداف اللغة</h3>
              <LanguageTargeting
                selectedLanguages={value.languages || []}
                onChange={handleLanguagesChange}
              />
            </div>
          </div>
        )}

        {/* تبويب الجدولة */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">جدولة عرض الإعلان</h3>
              <TimeScheduleComponent
                schedule={value.time_schedule}
                onChange={handleTimeScheduleChange}
              />
            </div>
          </div>
        )}

        {/* تبويب التكرار */}
        {activeTab === 'frequency' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">حد التكرار</h3>
              <FrequencyCapComponent
                cap={value.frequency_cap}
                onChange={handleFrequencyCapChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// مكون استهداف الأجهزة
interface DeviceTargetingProps {
  selectedDevices: DeviceType[];
  onChange: (devices: DeviceType[]) => void;
}

function DeviceTargeting({ selectedDevices, onChange }: DeviceTargetingProps) {
  const devices = [
    { type: 'all' as DeviceType, label: 'جميع الأجهزة', icon: '🖥️📱', description: 'عرض على جميع أنواع الأجهزة' },
    { type: 'mobile' as DeviceType, label: 'الهواتف المحمولة', icon: '📱', description: 'الهواتف الذكية والأجهزة المحمولة' },
    { type: 'tablet' as DeviceType, label: 'الأجهزة اللوحية', icon: '📱', description: 'iPad وأجهزة لوحية أخرى' },
    { type: 'desktop' as DeviceType, label: 'أجهزة سطح المكتب', icon: '🖥️', description: 'أجهزة الكمبيوتر المكتبية والمحمولة' }
  ];

  const handleDeviceToggle = (deviceType: DeviceType) => {
    if (deviceType === 'all') {
      onChange(['all']);
    } else {
      const newDevices = selectedDevices.includes('all') 
        ? [deviceType]
        : selectedDevices.includes(deviceType)
          ? selectedDevices.filter(d => d !== deviceType)
          : [...selectedDevices.filter(d => d !== 'all'), deviceType];
      
      onChange(newDevices.length === 0 ? ['all'] : newDevices);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {devices.map((device) => (
        <div
          key={device.type}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            selectedDevices.includes(device.type)
              ? 'border-primary bg-primary/10'
              : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
          }`}
          onClick={() => handleDeviceToggle(device.type)}
        >
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center ${
              selectedDevices.includes(device.type)
                ? 'border-primary bg-primary'
                : 'border-gray-500'
            }`}>
              {selectedDevices.includes(device.type) && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{device.icon}</span>
                <h4 className="font-medium text-white">{device.label}</h4>
              </div>
              <p className="text-sm text-dark-text-secondary">{device.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// مكون استهداف مصادر الزيارات
interface TrafficSourceTargetingProps {
  selectedSources: TrafficSource[];
  onChange: (sources: TrafficSource[]) => void;
}

function TrafficSourceTargeting({ selectedSources, onChange }: TrafficSourceTargetingProps) {
  const sources = [
    { type: 'direct' as TrafficSource, label: 'زيارات مباشرة', icon: '🔗', description: 'زوار يدخلون الموقع مباشرة' },
    { type: 'search' as TrafficSource, label: 'محركات البحث', icon: '🔍', description: 'زوار من Google وBing وغيرها' },
    { type: 'social' as TrafficSource, label: 'وسائل التواصل', icon: '📱', description: 'زوار من Facebook وTwitter وغيرها' },
    { type: 'referral' as TrafficSource, label: 'مواقع أخرى', icon: '🌐', description: 'زوار من مواقع ويب أخرى' },
    { type: 'email' as TrafficSource, label: 'البريد الإلكتروني', icon: '📧', description: 'زوار من حملات البريد الإلكتروني' },
    { type: 'ads' as TrafficSource, label: 'الإعلانات', icon: '📢', description: 'زوار من الإعلانات المدفوعة' }
  ];

  const handleSourceToggle = (sourceType: TrafficSource) => {
    const newSources = selectedSources.includes(sourceType)
      ? selectedSources.filter(s => s !== sourceType)
      : [...selectedSources, sourceType];
    
    onChange(newSources);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {sources.map((source) => (
        <label
          key={source.type}
          className="flex items-center gap-3 p-3 rounded-lg border border-gray-600 hover:border-gray-500 hover:bg-gray-700/30 cursor-pointer transition-all duration-200"
        >
          <input
            type="checkbox"
            checked={selectedSources.includes(source.type)}
            onChange={() => handleSourceToggle(source.type)}
            className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
          />
          <div className="flex items-center gap-2">
            <span>{source.icon}</span>
            <div>
              <div className="text-sm font-medium text-white">{source.label}</div>
              <div className="text-xs text-dark-text-secondary">{source.description}</div>
            </div>
          </div>
        </label>
      ))}
    </div>
  );
}

// مكون استهداف الموقع
interface LocationTargetingProps {
  selectedLocations: string[];
  onChange: (locations: string[]) => void;
}

function LocationTargeting({ selectedLocations, onChange }: LocationTargetingProps) {
  const [inputValue, setInputValue] = useState('');

  const commonLocations = [
    'السعودية', 'الإمارات', 'مصر', 'الكويت', 'قطر', 'البحرين', 'عمان',
    'الأردن', 'لبنان', 'سوريا', 'العراق', 'المغرب', 'الجزائر', 'تونس', 'ليبيا'
  ];

  const addLocation = (location: string) => {
    if (location && !selectedLocations.includes(location)) {
      onChange([...selectedLocations, location]);
    }
  };

  const removeLocation = (location: string) => {
    onChange(selectedLocations.filter(l => l !== location));
  };

  const addCustomLocation = () => {
    if (inputValue.trim()) {
      addLocation(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="space-y-4">
      {/* البلدان الشائعة */}
      <div>
        <h4 className="text-sm font-medium text-dark-text-secondary mb-3">البلدان الشائعة</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {commonLocations.map((location) => (
            <label key={location} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700/30 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLocations.includes(location)}
                onChange={(e) => {
                  if (e.target.checked) {
                    addLocation(location);
                  } else {
                    removeLocation(location);
                  }
                }}
                className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-sm text-dark-text">{location}</span>
            </label>
          ))}
        </div>
      </div>

      {/* إضافة موقع مخصص */}
      <div>
        <h4 className="text-sm font-medium text-dark-text-secondary mb-3">إضافة موقع مخصص</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomLocation()}
            placeholder="أدخل اسم البلد أو المدينة"
            className="flex-1 bg-dark-background border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={addCustomLocation}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            إضافة
          </button>
        </div>
      </div>

      {/* المواقع المحددة */}
      {selectedLocations.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-dark-text-secondary mb-3">المواقع المحددة</h4>
          <div className="flex flex-wrap gap-2">
            {selectedLocations.map((location) => (
              <span
                key={location}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
              >
                {location}
                <button
                  onClick={() => removeLocation(location)}
                  className="ml-1 text-primary hover:text-red-400 transition-colors duration-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// مكون استهداف اللغة
interface LanguageTargetingProps {
  selectedLanguages: string[];
  onChange: (languages: string[]) => void;
}

function LanguageTargeting({ selectedLanguages, onChange }: LanguageTargetingProps) {
  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const handleLanguageToggle = (langCode: string) => {
    const newLanguages = selectedLanguages.includes(langCode)
      ? selectedLanguages.filter(l => l !== langCode)
      : [...selectedLanguages, langCode];
    
    onChange(newLanguages);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {languages.map((language) => (
        <label
          key={language.code}
          className="flex items-center gap-3 p-3 rounded-lg border border-gray-600 hover:border-gray-500 hover:bg-gray-700/30 cursor-pointer transition-all duration-200"
        >
          <input
            type="checkbox"
            checked={selectedLanguages.includes(language.code)}
            onChange={() => handleLanguageToggle(language.code)}
            className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
          />
          <div className="flex items-center gap-2">
            <span>{language.flag}</span>
            <span className="text-sm font-medium text-white">{language.name}</span>
          </div>
        </label>
      ))}
    </div>
  );
}

// مكون الجدولة الزمنية
interface TimeScheduleComponentProps {
  schedule?: TimeSchedule;
  onChange: (schedule: TimeSchedule) => void;
}

function TimeScheduleComponent({ schedule, onChange }: TimeScheduleComponentProps) {
  const daysOfWeek = [
    { value: 0, label: 'الأحد', short: 'أح' },
    { value: 1, label: 'الاثنين', short: 'إث' },
    { value: 2, label: 'الثلاثاء', short: 'ثل' },
    { value: 3, label: 'الأربعاء', short: 'أر' },
    { value: 4, label: 'الخميس', short: 'خم' },
    { value: 5, label: 'الجمعة', short: 'جم' },
    { value: 6, label: 'السبت', short: 'سب' }
  ];

  const handleDayToggle = (day: number) => {
    const currentDays = schedule?.days_of_week || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort();
    
    onChange({
      ...schedule,
      days_of_week: newDays,
      hours: schedule?.hours || { start: 0, end: 23 },
      timezone: schedule?.timezone || 'Asia/Riyadh'
    });
  };

  const handleHoursChange = (start: number, end: number) => {
    onChange({
      ...schedule,
      days_of_week: schedule?.days_of_week || [0, 1, 2, 3, 4, 5, 6],
      hours: { start, end },
      timezone: schedule?.timezone || 'Asia/Riyadh'
    });
  };

  return (
    <div className="space-y-6">
      {/* أيام الأسبوع */}
      <div>
        <h4 className="text-sm font-medium text-dark-text-secondary mb-3">أيام الأسبوع</h4>
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <button
              key={day.value}
              onClick={() => handleDayToggle(day.value)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                schedule?.days_of_week?.includes(day.value)
                  ? 'bg-primary text-white'
                  : 'bg-gray-700 text-dark-text-secondary hover:bg-gray-600'
              }`}
            >
              <div className="text-center">
                <div className="font-bold">{day.short}</div>
                <div className="text-xs mt-1">{day.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ساعات اليوم */}
      <div>
        <h4 className="text-sm font-medium text-dark-text-secondary mb-3">ساعات العرض</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-dark-text-secondary mb-2">من الساعة</label>
            <select
              value={schedule?.hours?.start || 0}
              onChange={(e) => handleHoursChange(parseInt(e.target.value), schedule?.hours?.end || 23)}
              className="w-full bg-dark-background border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, '0')}:00
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-dark-text-secondary mb-2">إلى الساعة</label>
            <select
              value={schedule?.hours?.end || 23}
              onChange={(e) => handleHoursChange(schedule?.hours?.start || 0, parseInt(e.target.value))}
              className="w-full bg-dark-background border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, '0')}:00
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* المنطقة الزمنية */}
      <div>
        <h4 className="text-sm font-medium text-dark-text-secondary mb-3">المنطقة الزمنية</h4>
        <select
          value={schedule?.timezone || 'Asia/Riyadh'}
          onChange={(e) => onChange({
            ...schedule,
            days_of_week: schedule?.days_of_week || [0, 1, 2, 3, 4, 5, 6],
            hours: schedule?.hours || { start: 0, end: 23 },
            timezone: e.target.value
          })}
          className="w-full bg-dark-background border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="Asia/Riyadh">الرياض (GMT+3)</option>
          <option value="Asia/Dubai">دبي (GMT+4)</option>
          <option value="Africa/Cairo">القاهرة (GMT+2)</option>
          <option value="Asia/Kuwait">الكويت (GMT+3)</option>
          <option value="Asia/Qatar">الدوحة (GMT+3)</option>
          <option value="Asia/Bahrain">المنامة (GMT+3)</option>
          <option value="Asia/Muscat">مسقط (GMT+4)</option>
        </select>
      </div>
    </div>
  );
}

// مكون حد التكرار
interface FrequencyCapComponentProps {
  cap?: FrequencyCap;
  onChange: (cap: FrequencyCap) => void;
}

function FrequencyCapComponent({ cap, onChange }: FrequencyCapComponentProps) {
  const handleImpressionsChange = (impressions: number) => {
    onChange({
      impressions_per_user: impressions,
      time_period: cap?.time_period || 'day'
    });
  };

  const handleTimePeriodChange = (period: 'hour' | 'day' | 'week' | 'month') => {
    onChange({
      impressions_per_user: cap?.impressions_per_user || 3,
      time_period: period
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-2">
            عدد مرات العرض للمستخدم الواحد
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={cap?.impressions_per_user || 3}
            onChange={(e) => handleImpressionsChange(parseInt(e.target.value) || 3)}
            className="w-full bg-dark-background border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-2">
            خلال فترة
          </label>
          <select
            value={cap?.time_period || 'day'}
            onChange={(e) => handleTimePeriodChange(e.target.value as any)}
            className="w-full bg-dark-background border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="hour">ساعة واحدة</option>
            <option value="day">يوم واحد</option>
            <option value="week">أسبوع واحد</option>
            <option value="month">شهر واحد</option>
          </select>
        </div>
      </div>

      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-blue-400 text-lg">💡</div>
          <div>
            <h4 className="text-sm font-medium text-blue-400 mb-1">نصيحة</h4>
            <p className="text-xs text-blue-300">
              حد التكرار يساعد في تجنب إزعاج المستخدمين وتحسين تجربتهم. 
              القيمة الموصى بها هي 3-5 مرات في اليوم للإعلانات العادية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
