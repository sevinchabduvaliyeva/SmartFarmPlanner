
import { useEffect, useState, useRef  } from 'react'
import {
 Check, Sprout, LayoutDashboard, Map, Droplets, FlaskConical,
  CalendarDays, Bell, UserRound, Settings, LogOut,
  Search, Plus, ArrowUpRight, TrendingUp, CloudSun,
  Leaf, AlertTriangle, ChevronRight, Menu, X,
  Wheat, ThermometerSun, CloudRain, CheckCircle2,Pencil, Trash2, ChevronLeft, CheckCheck,User,Wind
} from 'lucide-react'
import { supabase } from '../supabase'
import '../styles/Dashboard.css'

const menuItems = [
  { label: 'Boshqaruv paneli', translation: 'dashboard', icon: LayoutDashboard },
  { label: 'Ekinlar', translation: 'crops', icon: Sprout },
  { label: 'Maydonlar', translation: 'fields', icon: Map },
  { label: 'Sug‘orish', translation: 'irrigation', icon: Droplets },
  { label: 'O‘g‘itlash', translation: 'fertilizer', icon: FlaskConical },
  { label: 'Kalendar', translation: 'calendar', icon: CalendarDays },
  { label: 'Bildirishnomalar', translation: 'notifications', icon: Bell },
  { label: 'Profil', translation: 'profile', icon: User },
]

const initialCrops = [
  { id: 1, name: 'Kuzgi bug‘doy', field: '1-maydon', area: 25, status: 'O‘sish jarayonida', color: 'green' },
  { id: 2, name: 'Makkajo‘xori', field: '2-maydon', area: 12, status: 'Hosilga tayyorlanmoqda', color: 'gold' },
]

const tasks = [
  { id: 1, title: '1-maydonni sug‘orish', time: '07:00', done: false },
  { id: 2, title: 'Ekin holatini tekshirish', time: '10:00', done: false },
  { id: 3, title: 'O‘g‘itlash rejasini ko‘rib chiqish', time: '16:00', done: true },
]

export default function Dashboard({ user }) {
  const [active, setActive] = useState('Boshqaruv paneli')
  const [mobileMenu, setMobileMenu] = useState(false)
 
const [crops, setCrops] = useState([])
const [taskList, setTaskList] = useState(tasks)
const [showCropForm, setShowCropForm] = useState(false)
const [cropName, setCropName] = useState('')
const [cropArea, setCropArea] = useState('')
const [plantedAt, setPlantedAt] = useState('2026-10-25')
const [cropStage, setCropStage] = useState('O‘sish jarayonida')
const [savingCrop, setSavingCrop] = useState(false)
const [notice, setNotice] = useState('')
const [editingCrop, setEditingCrop] = useState(null)
const [editCropName, setEditCropName] = useState('')
const [editCropArea, setEditCropArea] = useState('')
const [editPlantedAt, setEditPlantedAt] = useState('')
const [editCropStage, setEditCropStage] = useState('')
const [savingEdit, setSavingEdit] = useState(false)
const [fields, setFields] = useState([])
const [showFieldForm, setShowFieldForm] = useState(false)
const [fieldName, setFieldName] = useState('')
const [fieldArea, setFieldArea] = useState('')
const [fieldSoil, setFieldSoil] = useState('Qora tuproq')
const [savingField, setSavingField] = useState(false)
const [fieldNotice, setFieldNotice] = useState('')
const [editingFieldId, setEditingFieldId] = useState(null)
const [irrigationPlans, setIrrigationPlans] = useState([])
const [showIrrigationForm, setShowIrrigationForm] = useState(false)
const [irrigationFieldId, setIrrigationFieldId] = useState('')
const [irrigationDate, setIrrigationDate] = useState('')
const [irrigationTime, setIrrigationTime] = useState('07:00')
const [waterAmount, setWaterAmount] = useState('')
const [irrigationNotes, setIrrigationNotes] = useState('')
const [savingIrrigation, setSavingIrrigation] = useState(false)
const [irrigationNotice, setIrrigationNotice] = useState('')
const [editingIrrigationId, setEditingIrrigationId] = useState(null)
const [fertilizerPlans, setFertilizerPlans] = useState([])
const [showFertilizerForm, setShowFertilizerForm] = useState(false)
const [fertilizerFieldId, setFertilizerFieldId] = useState('')
const [fertilizerName, setFertilizerName] = useState('')
const [fertilizerAmount, setFertilizerAmount] = useState('')
const [fertilizerDate, setFertilizerDate] = useState('')
const [fertilizerTime, setFertilizerTime] = useState('08:00')
const [fertilizerNotes, setFertilizerNotes] = useState('')
const [fertilizerNotice, setFertilizerNotice] = useState('')
const [savingFertilizer, setSavingFertilizer] = useState(false)
const [editingFertilizerId, setEditingFertilizerId] = useState(null)
const [searchQuery, setSearchQuery] = useState('')
const [calendarMonth, setCalendarMonth] = useState(new Date())
const [selectedCalendarDate, setSelectedCalendarDate] = useState(
  new Date().toISOString().slice(0, 10)
)
const [notifications, setNotifications] = useState([])
const [irrigationNotificationsEnabled, setIrrigationNotificationsEnabled] = useState(
  localStorage.getItem('irrigationNotificationsEnabled') !== 'false'
)
const [darkTheme, setDarkTheme] = useState(
  localStorage.getItem('darkTheme') === 'true'
)
const [appLanguage, setAppLanguage] = useState(
  localStorage.getItem('appLanguage') || 'uz'
)
const [fertilizerNotificationsEnabled, setFertilizerNotificationsEnabled] = useState(
  localStorage.getItem('fertilizerNotificationsEnabled') !== 'false'
)
const [loadingNotifications, setLoadingNotifications] = useState(false)
const [profile, setProfile] = useState({
  full_name: '',
  phone: '',
  farm_name: '',
  farm_location: '',
  avatar_url: '',
})
const [weather, setWeather] = useState(null)
const [weatherLoading, setWeatherLoading] = useState(false)
const [weatherError, setWeatherError] = useState('')
const [weatherRefresh, setWeatherRefresh] = useState(0)
const [loadingProfile, setLoadingProfile] = useState(false)
const [savingProfile, setSavingProfile] = useState(false)
const [profileNotice, setProfileNotice] = useState('')
const [isEditingProfile, setIsEditingProfile] = useState(false)
const [showPasswordForm, setShowPasswordForm] = useState(false)
const [newPassword, setNewPassword] = useState('')
const [confirmPassword, setConfirmPassword] = useState('')
const [passwordNotice, setPasswordNotice] = useState('')
const [savingPassword, setSavingPassword] = useState(false)
useEffect(() => {
  const loadCrops = async () => {
    if (!user?.id) return

    const { data, error } = await supabase
      .from('crops')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setNotice('Ekinlarni yuklashda xatolik: ' + error.message)
      return
    }

    setCrops(
      (data || []).map((crop) => ({
        id: crop.id,
        name: crop.name,
        field: 'Yangi maydon',
        area: Number(crop.area_ha),
        status: crop.stage,
        color: 'green',
        plantedAt: crop.planted_at,
      }))
    )
  }

  loadCrops()
}, [user?.id])
useEffect(() => {
  const loadWeather = async () => {
    const location = profile.farm_location?.trim()

    if (!location) {
      setWeather(null)
      setWeatherError('Avval profilingizda xo‘jalik manzilini kiriting.')
      return
    }

    setWeatherLoading(true)
    setWeatherError('')

    try {
      // Manzilni koordinatalarga aylantirish
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=uz&format=json`
      )

      if (!geoResponse.ok) throw new Error('Manzilni aniqlab bo‘lmadi.')

      const geoData = await geoResponse.json()
      const place = geoData.results?.[0]

      if (!place) {
        throw new Error('Manzil topilmadi. Profil manzilini tekshiring.')
      }

      // Ob-havo ma’lumotlarini olish
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      )

      if (!weatherResponse.ok) {
        throw new Error('Ob-havo ma’lumotini yuklab bo‘lmadi.')
      }

      const weatherData = await weatherResponse.json()

      setWeather({
        ...weatherData,
        placeName: place.name,
        country: place.country,
      })
    } catch (error) {
      setWeatherError(error.message)
    } finally {
      setWeatherLoading(false)
    }
  }

  loadWeather()
}, [profile.farm_location, weatherRefresh])
useEffect(() => {
  if (!user?.id) return

  const loadFields = async () => {
    const { data, error } = await supabase
      .from('fields')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setFieldNotice('Maydonlarni yuklashda xatolik: ' + error.message)
      return
    }

    setFields(data || [])
  }

  loadFields()
}, [user?.id])
useEffect(() => {
  if (!user?.id) return

  const loadIrrigationPlans = async () => {
    const { data, error } = await supabase
      .from('irrigation_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setIrrigationNotice(
        'Sug‘orish rejalarini yuklashda xatolik: ' + error.message
      )
      return
    }

    setIrrigationPlans(data || [])
  }

  loadIrrigationPlans()
}, [user?.id])
const checkingIrrigation = useRef(false)

useEffect(() => {
  if (!user?.id || irrigationPlans.length === 0) return

  const checkIrrigationStatuses = async () => {
    if (checkingIrrigation.current) return

    checkingIrrigation.current = true

    try {
      const now = new Date()

      const plansToStart = irrigationPlans.filter((plan) => {
        if (plan.status !== 'Rejalashtirilgan') return false

        const scheduledTime = new Date(
          `${plan.irrigation_date}T${String(plan.irrigation_time).slice(0, 8)}`
        )

        return !Number.isNaN(scheduledTime.getTime()) &&
          scheduledTime <= now
      })

      for (const plan of plansToStart) {
        await updateIrrigationStatus(plan.id, 'Jarayonda')
      }
    } finally {
      checkingIrrigation.current = false
    }
  }

  checkIrrigationStatuses()

  const timer = setInterval(checkIrrigationStatuses, 30000)

  return () => clearInterval(timer)
}, [user?.id, irrigationPlans])
useEffect(() => {
  if (!user?.id) return

  const loadFertilizerPlans = async () => {
    const { data, error } = await supabase
      .from('fertilizer_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setFertilizerNotice(
        'O‘g‘itlash rejalarini yuklashda xatolik: ' + error.message
      )
      return
    }

    setFertilizerPlans(data || [])
  }

  loadFertilizerPlans()
}, [user?.id])
useEffect(() => {
  if (!user?.id) return

  const loadNotifications = async () => {
    setLoadingNotifications(true)

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Bildirishnomalarni yuklashda xatolik:', error.message)
      setLoadingNotifications(false)
      return
    }

    setNotifications(data || [])
    setLoadingNotifications(false)
  }

  loadNotifications()
}, [user?.id])
useEffect(() => {
  if (!user?.id) return

  const loadProfile = async () => {
    setLoadingProfile(true)
    setProfileNotice('')

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Profilni yuklashda xatolik:', error.message)
      setProfileNotice('Profil ma’lumotlarini yuklashda xatolik yuz berdi.')
      setLoadingProfile(false)
      return
    }

    setProfile({
      full_name: data?.full_name || user?.user_metadata?.full_name || '',
      phone: data?.phone || '',
      farm_name: data?.farm_name || '',
      farm_location: data?.farm_location || '',
      avatar_url: data?.avatar_url || '',
    })

    setLoadingProfile(false)
  }

  loadProfile()
}, [user?.id])
const saveProfile = async (e) => {
  e.preventDefault()

  if (!user?.id) {
    setProfileNotice('Foydalanuvchi aniqlanmadi.')
    return
  }

  if (!profile.full_name.trim()) {
    setProfileNotice('Ism va familiyani kiriting.')
    return
  }

  setSavingProfile(true)
  setProfileNotice('')

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: profile.full_name.trim(),
      phone: profile.phone.trim(),
      farm_name: profile.farm_name.trim(),
      farm_location: profile.farm_location.trim(),
      avatar_url: profile.avatar_url,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Profilni saqlashda xatolik:', error.message)
    setProfileNotice('Saqlashda xatolik: ' + error.message)
  } else {
  await supabase.auth.updateUser({
    data: {
      full_name: profile.full_name.trim(),
    },
  })

  setIsEditingProfile(false)
  setProfileNotice('Profil muvaffaqiyatli saqlandi.')
}

  setSavingProfile(false)
}
const uploadProfileAvatar = async (e) => {
  const file = e.target.files?.[0]

  if (!file) return

  if (!file.type.startsWith('image/')) {
    setProfileNotice('Faqat rasm faylini tanlang.')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    setProfileNotice('Rasm hajmi 5 MB dan oshmasligi kerak.')
    return
  }

  setProfileNotice('Rasm yuklanmoqda...')

  const fileExt = file.name.split('.').pop()
  const filePath = `${user.id}/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Rasm yuklashda xatolik:', uploadError.message)
    setProfileNotice('Rasm yuklanmadi: ' + uploadError.message)
    return
  }

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  const avatarUrl = data.publicUrl

  const { error: updateError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })

  if (updateError) {
    console.error('Profil rasmini saqlashda xatolik:', updateError.message)
    setProfileNotice('Rasm profilga saqlanmadi: ' + updateError.message)
    return
  }

  setProfile((prev) => ({
    ...prev,
    avatar_url: avatarUrl,
  }))

  setProfileNotice('Profil rasmi muvaffaqiyatli yangilandi.')
}
const changePassword = async (e) => {
  e.preventDefault()
  setPasswordNotice('')

  if (newPassword.length < 8) {
    setPasswordNotice('Parol kamida 8 ta belgidan iborat bo‘lishi kerak.')
    return
  }

  if (newPassword !== confirmPassword) {
    setPasswordNotice('Parollar bir-biriga mos kelmaydi.')
    return
  }

  setSavingPassword(true)

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    console.error('Parolni o‘zgartirishda xatolik:', error.message)
    setPasswordNotice('Parolni o‘zgartirib bo‘lmadi: ' + error.message)
  } else {
    setPasswordNotice('Parol muvaffaqiyatli o‘zgartirildi.')
    setNewPassword('')
    setConfirmPassword('')
    setShowPasswordForm(false)
  }

  setSavingPassword(false)
}
const markNotificationAsRead = async (notificationId) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Bildirishnomani yangilashda xatolik:', error.message)
    return
  }

  setNotifications((prev) =>
    prev.map((item) =>
      item.id === notificationId
        ? { ...item, is_read: true }
        : item
    )
  )
}
const deleteNotification = async (notificationId) => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Bildirishnomani o‘chirishda xatolik:', error.message)
    return
  }

  setNotifications((prev) =>
    prev.filter((item) => item.id !== notificationId)
  )
}
const markAllNotificationsAsRead = async () => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) {
    console.error('Bildirishnomalarni yangilashda xatolik:', error.message)
    return
  }

  setNotifications((prev) =>
    prev.map((item) => ({ ...item, is_read: true }))
  )
}
const deleteAllNotifications = async () => {
  const confirmed = window.confirm(
    'Barcha bildirishnomalarni o‘chirishni xohlaysizmi?'
  )

  if (!confirmed) return

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', user.id)

  if (error) {
    console.error('Bildirishnomalarni o‘chirishda xatolik:', error.message)
    return
  }

  setNotifications([])
}
const checkingFertilizer = useRef(false)

useEffect(() => {
  if (!user?.id || fertilizerPlans.length === 0) return

  const checkFertilizerStatuses = async () => {
    if (checkingFertilizer.current) return

    checkingFertilizer.current = true

    try {
      const now = new Date()

      const plansToStart = fertilizerPlans.filter((plan) => {
        if (plan.status !== 'Rejalashtirilgan') return false
        if (!plan.fertilizer_time) return false

        const scheduledTime = new Date(
          `${plan.fertilizer_date}T${String(plan.fertilizer_time).slice(0, 8)}`
        )

        return (
          !Number.isNaN(scheduledTime.getTime()) &&
          scheduledTime <= now
        )
      })

      for (const plan of plansToStart) {
        await updateFertilizerStatus(plan.id, 'Jarayonda')
      }
    } finally {
      checkingFertilizer.current = false
    }
  }

  checkFertilizerStatuses()

  const timer = setInterval(checkFertilizerStatuses, 30000)

  return () => clearInterval(timer)
}, [user?.id, fertilizerPlans])
  const firstName =
    user?.user_metadata?.first_name ||
    user?.user_metadata?.full_name?.split(' ')[0] ||
    'Fermer'

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) setNotice('Chiqishda xatolik: ' + error.message)
  }

 
const addCrop = async (e) => {
  e.preventDefault()

  if (!cropName.trim() || Number(cropArea) <= 0 || !plantedAt || !cropStage) {
    setNotice('Barcha maydonlarni to‘g‘ri to‘ldiring.')
    return
  }

  if (!user?.id) {
    setNotice('Foydalanuvchi aniqlanmadi. Qayta tizimga kiring.')
    return
  }

  setSavingCrop(true)
  setNotice('')

  try {
    const { data, error } = await supabase
      .from('crops')
      .insert({
        user_id: user.id,
        name: cropName.trim(),
        area_ha: Number(cropArea),
        planted_at: plantedAt,
        stage: cropStage,
      })
      .select()
      .single()

    if (error) throw error

    setCrops((old) => [
      ...old,
      {
        id: data.id,
        name: data.name,
        field: 'Yangi maydon',
        area: Number(data.area_ha),
        status: data.stage,
        color: 'green',
        plantedAt: data.planted_at,
      },
    ])

    setCropName('')
    setCropArea('')
    setPlantedAt('2026-10-25')
    setCropStage('O‘sish jarayonida')
    setShowCropForm(false)
    setNotice('Ekin Supabase bazasiga muvaffaqiyatli saqlandi.')
  } catch (error) {
    setNotice('Ekinni saqlashda xatolik: ' + error.message)
  } finally {
    setSavingCrop(false)
  }
}

const addField = async (e) => {
  e.preventDefault()

  if (!fieldName.trim() || Number(fieldArea) <= 0 || !fieldSoil) {
    setFieldNotice(t('fillAllFields'))
    return
  }

  if (!user?.id) {
    setFieldNotice(t('loginAgain'))
    return
  }

  setSavingField(true)
  setFieldNotice('')

  try {
    const { data, error } = await supabase
      .from('fields')
      .insert({
        user_id: user.id,
        name: fieldName.trim(),
        area_ha: Number(fieldArea),
        soil: fieldSoil,
      })
      .select()
      .single()

    if (error) throw error

    setFields((old) => [data, ...old])
    setFieldName('')
    setFieldArea('')
    setFieldSoil('Qora tuproq')
    setShowFieldForm(false)
    setFieldNotice(t('fieldSaved'))
  } catch (error) {
    setFieldNotice(t('fieldSaveError') + error.message)
  } finally {
    setSavingField(false)
  }
}

const addIrrigationPlan = async (e) => {
  e.preventDefault()

  if (
    !irrigationFieldId ||
    !irrigationDate ||
    !irrigationTime ||
    Number(waterAmount) <= 0
  ) {
    setIrrigationNotice(t('irrigationRequiredFields'))
    return
  }

  if (!user?.id) {
    setIrrigationNotice(t('loginAgain'))
    return
  }

  setSavingIrrigation(true)
  setIrrigationNotice('')

  try {
    const { data, error } = await supabase
      .from('irrigation_plans')
      .insert({
        user_id: user.id,
        field_id: Number(irrigationFieldId),
        irrigation_date: irrigationDate,
        irrigation_time: irrigationTime,
        water_amount: Number(waterAmount),
        notes: irrigationNotes.trim() || null,
        status: 'Rejalashtirilgan',
      })
      .select()
      .single()

    if (error) throw error

    if (irrigationNotificationsEnabled) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title:
            appLanguage === 'uz' ? 'Yangi sug‘orish rejasi' :
            appLanguage === 'ru' ? 'Новый план полива' :
            'New irrigation plan',

          message:
            appLanguage === 'uz'
              ? `${irrigationDate} kuni soat ${irrigationTime} da sug‘orish rejalashtirildi.`
              : appLanguage === 'ru'
                ? `Полив запланирован на ${irrigationDate} в ${irrigationTime}.`
                : `Irrigation is scheduled for ${irrigationDate} at ${irrigationTime}.`,

          type: 'irrigation',
          related_id: data.id,
          is_read: false,
        })

      if (notificationError) {
        console.error(
          'Bildirishnoma yaratilmadi:',
          notificationError.message
        )
      } else {
        const { data: newNotification } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .eq('related_id', data.id)
          .eq('type', 'irrigation')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (newNotification) {
          setNotifications((old) => [newNotification, ...old])
        }
      }
    }

    setIrrigationPlans((old) => [data, ...old])
    setIrrigationFieldId('')
    setIrrigationDate('')
    setIrrigationTime('07:00')
    setWaterAmount('')
    setIrrigationNotes('')
    setShowIrrigationForm(false)
    setIrrigationNotice(t('irrigationSaved'))

  } catch (error) {
    setIrrigationNotice(
      t('irrigationSaveError') + error.message
    )
  } finally {
    setSavingIrrigation(false)
  }
}
const addFertilizerPlan = async (e) => {
  e.preventDefault()

  if (
    !fertilizerFieldId ||
    !fertilizerName.trim() ||
    Number(fertilizerAmount) <= 0 ||
    !fertilizerDate
  ) {
    setFertilizerNotice(t('irrigationRequiredFields'))
    return
  }

  if (!user?.id) {
    setFertilizerNotice(t('loginAgain'))
    return
  }

  setSavingFertilizer(true)
  setFertilizerNotice('')

  try {
    const { data, error } = await supabase
      .from('fertilizer_plans')
      .insert({
        user_id: user.id,
        field_id: Number(fertilizerFieldId),
        fertilizer_name: fertilizerName.trim(),
        fertilizer_amount: Number(fertilizerAmount),
        fertilizer_date: fertilizerDate,
        fertilizer_time: fertilizerTime,
        notes: fertilizerNotes.trim() || null,
        status: 'Rejalashtirilgan',
      })
      .select()
      .single()

    if (error) throw error

    if (fertilizerNotificationsEnabled) {
      const { data: newNotification, error: notificationError } =
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            title:
              appLanguage === 'uz'
                ? 'Yangi o‘g‘itlash rejasi'
                : appLanguage === 'ru'
                  ? 'Новый план внесения удобрений'
                  : 'New fertilization plan',

            message:
              appLanguage === 'uz'
                ? `${fertilizerName.trim()} — ${fertilizerDate} kuni soat ${fertilizerTime} da o‘g‘itlash rejalashtirildi.`
                : appLanguage === 'ru'
                  ? `${fertilizerName.trim()} — внесение удобрений запланировано на ${fertilizerDate} в ${fertilizerTime}.`
                  : `${fertilizerName.trim()} — fertilization is scheduled for ${fertilizerDate} at ${fertilizerTime}.`,

            type: 'fertilizer',
            related_id: data.id,
            is_read: false,
          })
          .select()
          .single()

      if (notificationError) {
        console.error(
          'Bildirishnoma yaratilmadi:',
          notificationError.message
        )
      } else {
        setNotifications((old) => [newNotification, ...old])
      }
    }

    setFertilizerPlans((old) => [data, ...old])
    setFertilizerFieldId('')
    setFertilizerName('')
    setFertilizerAmount('')
    setFertilizerDate('')
    setFertilizerNotes('')
    setShowFertilizerForm(false)
    setFertilizerNotice(t('fertilizerSaved'))

  } catch (error) {
    setFertilizerNotice(t('fertilizerSaveError') + error.message)
  } finally {
    setSavingFertilizer(false)
  }
}
const startEditIrrigation = (plan) => {
  setEditingIrrigationId(plan.id)
  setIrrigationFieldId(String(plan.field_id))
  setIrrigationDate(plan.irrigation_date)
  setIrrigationTime(String(plan.irrigation_time).slice(0, 5))
  setWaterAmount(String(plan.water_amount))
  setIrrigationNotes(plan.notes || '')
  setShowIrrigationForm(true)
  setIrrigationNotice('')
}
const startEditFertilizer = (plan) => {
  setEditingFertilizerId(plan.id)
  setFertilizerFieldId(String(plan.field_id))
  setFertilizerName(plan.fertilizer_name)
  setFertilizerAmount(String(plan.fertilizer_amount))
  setFertilizerDate(plan.fertilizer_date)
  setFertilizerTime(
  String(plan.fertilizer_time || '08:00').slice(0, 5)
)
  setFertilizerNotes(plan.notes || '')
  setShowFertilizerForm(true)
  setFertilizerNotice('')
}
const saveEditedIrrigation = async (e) => {
  e.preventDefault()

  if (
    !irrigationFieldId ||
    !irrigationDate ||
    !irrigationTime ||
    Number(waterAmount) <= 0
  ) {
    setIrrigationNotice(t('irrigationRequiredFields'))
    return
  }

  if (!user?.id) {
    setIrrigationNotice(t('loginAgain'))
    return
  }

  setSavingIrrigation(true)
  setIrrigationNotice('')

  try {
    const { data, error } = await supabase
      .from('irrigation_plans')
      .update({
        field_id: Number(irrigationFieldId),
        irrigation_date: irrigationDate,
        irrigation_time: irrigationTime,
        water_amount: Number(waterAmount),
        notes: irrigationNotes.trim() || null,
      })
      .eq('id', editingIrrigationId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    setIrrigationPlans((old) =>
      old.map((plan) =>
        plan.id === editingIrrigationId ? data : plan
      )
    )

    setEditingIrrigationId(null)
    setIrrigationFieldId('')
    setIrrigationDate('')
    setIrrigationTime('07:00')
    setWaterAmount('')
    setIrrigationNotes('')
    setShowIrrigationForm(false)
    setIrrigationNotice(t('irrigationUpdated'))
  } catch (error) {
    setIrrigationNotice(
      t('irrigationUpdateError') + error.message
    )
  } finally {
    setSavingIrrigation(false)
  }
}
const saveEditedFertilizer = async (e) => {
  e.preventDefault()

  if (
    !fertilizerFieldId ||
    !fertilizerName.trim() ||
    Number(fertilizerAmount) <= 0 ||
    !fertilizerDate
  ) {
    setFertilizerNotice(t('irrigationRequiredFields'))
    return
  }

  if (!user?.id || editingFertilizerId === null) {
    setFertilizerNotice(t('fertilizerEditNotFound'))
    return
  }

  setSavingFertilizer(true)
  setFertilizerNotice('')

  try {
    const { data, error } = await supabase
      .from('fertilizer_plans')
      .update({
        field_id: Number(fertilizerFieldId),
        fertilizer_name: fertilizerName.trim(),
        fertilizer_amount: Number(fertilizerAmount),
        fertilizer_date: fertilizerDate,
        fertilizer_time: fertilizerTime,
        notes: fertilizerNotes.trim() || null,
      })
      .eq('id', editingFertilizerId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    setFertilizerPlans((old) =>
      old.map((plan) =>
        plan.id === editingFertilizerId ? data : plan
      )
    )

    setEditingFertilizerId(null)
    setFertilizerFieldId('')
    setFertilizerName('')
    setFertilizerAmount('')
    setFertilizerDate('')
    setFertilizerNotes('')
    setShowFertilizerForm(false)
    setFertilizerNotice(t('fertilizerUpdated'))
  } catch (error) {
    setFertilizerNotice(t('fertilizerUpdateError') + error.message)
  } finally {
    setSavingFertilizer(false)
  }
}
const updateIrrigationStatus = async (planId, newStatus) => {
  if (!user?.id) {
    setIrrigationNotice('Qayta tizimga kiring.')
    return
  }

  setIrrigationNotice('')

  try {
    const { data, error } = await supabase
      .from('irrigation_plans')
      .update({ status: newStatus })
      .eq('id', planId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    setIrrigationPlans((old) =>
      old.map((plan) => plan.id === planId ? data : plan)
    )

    setIrrigationNotice('Sug‘orish holati yangilandi.')
    if (newStatus === 'Jarayonda') {
  const { data: existingNotification } = await supabase
    .from('notifications')
    .select('id')
    .eq('user_id', user.id)
    .eq('type', 'irrigation_started')
    .eq('related_id', planId)
    .maybeSingle()

  if (!existingNotification) {
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        title:
          appLanguage === 'uz' ? 'Sug‘orish vaqti keldi' :
          appLanguage === 'ru' ? 'Время полива' :
          'Time to irrigate',

        message:
          appLanguage === 'uz'
            ? 'Rejalashtirilgan sug‘orish vaqti boshlandi.'
            : appLanguage === 'ru'
            ? 'Наступило запланированное время полива.'
            : 'The scheduled irrigation time has started.',

        type: 'irrigation_started',
        related_id: planId,
        is_read: false
      })

    if (notificationError) {
      console.error('Bildirishnoma yaratilmadi:', notificationError)
    }
  }
}
  } catch (error) {
    setIrrigationNotice('Holatni yangilashda xatolik: ' + error.message)
  }
}
const updateFertilizerStatus = async (planId, newStatus) => {
  if (!user?.id) {
    setFertilizerNotice(t('loginAgain'))
    return
  }

  setFertilizerNotice('')

  try {
    const { data, error } = await supabase
      .from('fertilizer_plans')
      .update({ status: newStatus })
      .eq('id', planId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    setFertilizerPlans((old) =>
      old.map((plan) => plan.id === planId ? data : plan)
    )

    setFertilizerNotice(t('fertilizerStatusUpdated'))

    if (newStatus === 'Jarayonda') {
      const { data: existingNotification } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'fertilizer_started')
        .eq('related_id', planId)
        .maybeSingle()

      if (!existingNotification) {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            title:
              appLanguage === 'uz' ? 'O‘g‘itlash vaqti keldi' :
              appLanguage === 'ru' ? 'Время внесения удобрений' :
              'Time to fertilize',

            message:
              appLanguage === 'uz'
                ? 'Rejalashtirilgan o‘g‘itlash vaqti boshlandi.'
                : appLanguage === 'ru'
                ? 'Наступило запланированное время внесения удобрений.'
                : 'The scheduled fertilization time has started.',

            type: 'fertilizer_started',
            related_id: planId,
            is_read: false
          })

        if (notificationError) {
          console.error('Bildirishnoma yaratilmadi:', notificationError)
        }
      }
    }
  } catch (error) {
    setFertilizerNotice(
      t('fertilizerStatusUpdateError') + error.message
    )
  }
}
const checkIrrigationStatuses = async () => {
  if (!user?.id) return

  const now = new Date()

  const plansToStart = irrigationPlans.filter((plan) => {
    if (plan.status !== 'Rejalashtirilgan') return false

    const scheduledTime = new Date(
      `${plan.irrigation_date}T${String(plan.irrigation_time).slice(0, 8)}`
    )

    return scheduledTime <= now
  })

  for (const plan of plansToStart) {
    await updateIrrigationStatus(plan.id, 'Jarayonda')
  }
}

const deleteIrrigationPlan = async (planId) => {
  const confirmed = window.confirm(
    t('confirmDeleteIrrigation')
  )

  if (!confirmed) return

  if (!user?.id) {
    setIrrigationNotice(t('loginAgain'))
    return
  }

  setIrrigationNotice('')

  try {
    const { error } = await supabase
      .from('irrigation_plans')
      .delete()
      .eq('id', planId)
      .eq('user_id', user.id)

    if (error) throw error

    setIrrigationPlans((old) =>
      old.filter((plan) => plan.id !== planId)
    )

    setIrrigationNotice(t('irrigationDeleted'))
  } catch (error) {
    setIrrigationNotice(
      t('irrigationDeleteError') + error.message
    )
  }
}
const deleteFertilizerPlan = async (planId) => {
  if (!user?.id) {
    setFertilizerNotice(t('loginAgain'))
    return
  }

  const confirmed = window.confirm(
    t('confirmDeleteFertilizer')
  )

  if (!confirmed) return

  setFertilizerNotice('')

  try {
    const { error } = await supabase
      .from('fertilizer_plans')
      .delete()
      .eq('id', planId)
      .eq('user_id', user.id)

    if (error) throw error

    setFertilizerPlans((old) =>
      old.filter((plan) => plan.id !== planId)
    )

    setFertilizerNotice(t('fertilizerDeleted'))
  } catch (error) {
    setFertilizerNotice(t('fertilizerDeleteError') + error.message)
  }
}
const startEditField = (field) => {
  setEditingFieldId(field.id)
  setFieldName(field.name)
  setFieldArea(String(field.area_ha))
  setFieldSoil(field.soil)
  setShowFieldForm(true)
  setFieldNotice('')
}

const saveEditedField = async (e) => {
  e.preventDefault()

  if (!fieldName.trim() || Number(fieldArea) <= 0 || !fieldSoil) {
    setFieldNotice(t('fillAllFields'))
    return
  }

  if (!user?.id) {
    setFieldNotice(t('loginAgain'))
    return
  }

  setSavingField(true)
  setFieldNotice('')

  try {
    const { data, error } = await supabase
      .from('fields')
      .update({
        name: fieldName.trim(),
        area_ha: Number(fieldArea),
        soil: fieldSoil,
      })
      .eq('id', editingFieldId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    setFields((old) =>
      old.map((field) =>
        field.id === editingFieldId ? data : field
      )
    )

    setEditingFieldId(null)
    setFieldName('')
    setFieldArea('')
    setFieldSoil('Qora tuproq')
    setShowFieldForm(false)
    setFieldNotice(t('fieldUpdated'))
  } catch (error) {
    setFieldNotice(t('fieldUpdateError') + error.message)
  } finally {
    setSavingField(false)
  }
}
const deleteField = async (fieldId) => {
  const confirmed = window.confirm(t('confirmDeleteField'))

  if (!confirmed) return

  if (!user?.id) {
    setFieldNotice(t('loginAgain'))
    return
  }

  setFieldNotice('')

  try {
    const { error } = await supabase
      .from('fields')
      .delete()
      .eq('id', fieldId)
      .eq('user_id', user.id)

    if (error) throw error

    setFields((old) => old.filter((field) => field.id !== fieldId))
    setFieldNotice(t('fieldDeleted'))
  } catch (error) {
    setFieldNotice(t('fieldDeleteError') + error.message)
  }
}
const startEditCrop = (crop) => {
  setEditingCrop(crop)
  setEditCropName(crop.name)
  setEditCropArea(String(crop.area))
  setEditPlantedAt(crop.plantedAt || '')
  setEditCropStage(crop.status)
}

const saveEditedCrop = async (e) => {
  e.preventDefault()

  if (
    !editingCrop ||
    !editCropName.trim() ||
    Number(editCropArea) <= 0 ||
    !editPlantedAt ||
    !editCropStage
  ) {
    setNotice('Barcha maydonlarni to‘g‘ri to‘ldiring.')
    return
  }

  setSavingEdit(true)
  setNotice('')

  try {
    const { data, error } = await supabase
      .from('crops')
      .update({
        name: editCropName.trim(),
        area_ha: Number(editCropArea),
        planted_at: editPlantedAt,
        stage: editCropStage,
      })
      .eq('id', editingCrop.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    setCrops((old) =>
      old.map((crop) =>
        crop.id === data.id
          ? {
              ...crop,
              name: data.name,
              area: Number(data.area_ha),
              plantedAt: data.planted_at,
              status: data.stage,
            }
          : crop
      )
    )

    setEditingCrop(null)
setNotice(t('cropUpdated'))
} catch (error) {
  setNotice(t('cropEditError') + error.message)
} finally {
  setSavingEdit(false)
}
}


  const toggleTask = (id) => {
    setTaskList((old) =>
      old.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    )
  }

  const totalArea = crops.reduce((sum, crop) => sum + crop.area, 0)
  const normalizedSearch = searchQuery.trim().toLowerCase()

const searchResults = normalizedSearch
  ? [
      ...crops.map((item) => ({
        ...item,
        searchType: 'crop',
        searchName: item.name,
      })),
      ...fields.map((item) => ({
        ...item,
        searchType: 'field',
        searchName: item.name,
      })),
      ...irrigationPlans.map((item) => ({
        ...item,
        searchType: 'irrigation',
        searchName: item.notes || 'Sug‘orish rejasi',
      })),
      ...fertilizerPlans.map((item) => ({
        ...item,
        searchType: 'fertilizer',
        searchName: item.fertilizer_name,
      })),
    ].filter((item) =>
      String(item.searchName || '')
        .toLowerCase()
        .includes(normalizedSearch)
    )
  : []
  const getWeatherDescription = (code) => {
  const descriptions = {
    0: ['Ochiq, quyoshli', 'Ясно, солнечно', 'Clear sky'],
    1: ['Asosan ochiq', 'Преимущественно ясно', 'Mainly clear'],
    2: ['Qisman bulutli', 'Переменная облачность', 'Partly cloudy'],
    3: ['Bulutli', 'Пасмурно', 'Overcast'],
    45: ['Tuman', 'Туман', 'Fog'],
    48: ['Qalin tuman', 'Сильный туман', 'Rime fog'],
    51: ['Mayda yomg‘ir', 'Лёгкая морось', 'Light drizzle'],
    53: ['Yomg‘irli', 'Морось', 'Drizzle'],
    55: ['Kuchli mayda yomg‘ir', 'Сильная морось', 'Dense drizzle'],
    56: ['Muzli yomg‘ir', 'Ледяная морось', 'Freezing drizzle'],
    57: ['Kuchli muzli yomg‘ir', 'Сильная ледяная морось', 'Freezing drizzle'],
    61: ['Yengil yomg‘ir', 'Небольшой дождь', 'Slight rain'],
    63: ['Yomg‘ir', 'Дождь', 'Rain'],
    65: ['Kuchli yomg‘ir', 'Сильный дождь', 'Heavy rain'],
    66: ['Muzli yomg‘ir', 'Ледяной дождь', 'Freezing rain'],
    67: ['Kuchli muzli yomg‘ir', 'Сильный ледяной дождь', 'Heavy freezing rain'],
    71: ['Yengil qor', 'Небольшой снег', 'Slight snow'],
    73: ['Qor', 'Снег', 'Snow'],
    75: ['Kuchli qor', 'Сильный снег', 'Heavy snow'],
    77: ['Qor donachalari', 'Снежные зёрна', 'Snow grains'],
    80: ['Jala', 'Ливень', 'Rain showers'],
    81: ['Kuchli jala', 'Сильный ливень', 'Heavy showers'],
    82: ['Juda kuchli jala', 'Очень сильный ливень', 'Violent showers'],
    85: ['Qor yog‘ishi', 'Снегопад', 'Snow showers'],
    86: ['Kuchli qor yog‘ishi', 'Сильный снегопад', 'Heavy snow showers'],
    95: ['Momaqaldiroq', 'Гроза', 'Thunderstorm'],
    96: ['Do‘l bilan momaqaldiroq', 'Гроза с градом', 'Thunderstorm with hail'],
    99: ['Kuchli do‘lli momaqaldiroq', 'Сильная гроза с градом', 'Heavy thunderstorm with hail'],
  }

  const languageIndex =
    appLanguage === 'ru' ? 1 :
    appLanguage === 'en' ? 2 : 0

  return descriptions[code]?.[languageIndex] || (
    appLanguage === 'ru' ? 'Неизвестная погода' :
    appLanguage === 'en' ? 'Unknown weather' :
    'Noma’lum ob-havo'
  )
}
  const irrigationProgress =
  irrigationPlans.length > 0
    ? Math.round(
        (irrigationPlans.filter(
          (plan) => plan.status === 'Bajarildi'
        ).length / irrigationPlans.length) * 100
      )
    : 0
    const fertilizerProgress =
  fertilizerPlans.length > 0
    ? Math.round(
        (fertilizerPlans.filter(
          (plan) => plan.status === 'Bajarildi'
        ).length / fertilizerPlans.length) * 100
      )
    : 0
const today = new Date()
const todayDate = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, '0'),
  String(today.getDate()).padStart(2, '0'),
].join('-')

const todayTasks = [
  ...irrigationPlans
    .filter((plan) => plan.irrigation_date === todayDate)
    .map((plan) => ({
      id: `irrigation-${plan.id}`,
      planId: plan.id,
      type: 'irrigation',
      title: 'Sug‘orish',
      time: plan.irrigation_time?.slice(0, 5) || '',
      done: plan.status === 'Bajarildi',
    })),

  ...fertilizerPlans
    .filter((plan) => plan.fertilizer_date === todayDate)
    .map((plan) => ({
      id: `fertilizer-${plan.id}`,
      planId: plan.id,
      type: 'fertilizer',
      title: `O‘g‘itlash: ${plan.fertilizer_name}`,
      time: plan.fertilizer_time?.slice(0, 5) || '',
      done: plan.status === 'Bajarildi',
    })),
].sort((a, b) => a.time.localeCompare(b.time))
  const pageDescriptions = {
    'Ekinlar': 'Ekinlaringizni qo‘shing va ularning holatini kuzating.',
    'Maydonlar': 'Fermer xo‘jaligingiz maydonlarini boshqaring.',
    'Sug‘orish': 'Sug‘orish rejalari va suv holatini kuzating.',
    'O‘g‘itlash': 'Ekinlar uchun o‘g‘itlash ishlarini rejalashtiring.',
    'Kalendar': 'Fermerlik ishlaringiz jadvalini boshqaring.',
    'Bildirishnomalar': 'Muhim eslatmalar va ogohlantirishlar.',
    'Profil': 'Hisobingiz haqidagi ma’lumotlar.',
  }

const deleteCrop = async (cropId) => {
  const confirmed = window.confirm(
    'Bu ekinni o‘chirishni xohlaysizmi?'
  )

  if (!confirmed) return

  if (!user?.id) {
    setNotice('Qayta tizimga kiring.')
    return
  }

  setNotice('')

  try {
    const { error } = await supabase
      .from('crops')
      .delete()
      .eq('id', cropId)
      .eq('user_id', user.id)

    if (error) throw error

    setCrops((old) =>
      old.filter((crop) => crop.id !== cropId)
    )

    if (editingCrop?.id === cropId) {
      setEditingCrop(null)
    }

    setNotice('Ekin muvaffaqiyatli o‘chirildi.')
  } catch (error) {
    setNotice('O‘chirishda xatolik: ' + error.message)
  }
}
const calendarYear = calendarMonth.getFullYear()
const calendarMonthIndex = calendarMonth.getMonth()

const daysInMonth = new Date(
  calendarYear,
  calendarMonthIndex + 1,
  0
).getDate()

const firstDayOffset = (
  new Date(calendarYear, calendarMonthIndex, 1).getDay() + 6
) % 7

const calendarDays = [
  ...Array(firstDayOffset).fill(null),
  ...Array.from({ length: daysInMonth }, (_, index) => index + 1)
]

const monthName = calendarMonth.toLocaleDateString('uz-UZ', {
  month: 'long',
  year: 'numeric'
})
const translations = {
  uz: {
    dashboard: 'Boshqaruv paneli',
    farmerCabinet: 'fermer kabineti',
welcome: 'Xush kelibsiz',
dashboardIntro: 'Bugun xo‘jaligingiz holati bilan tanishing.',
addCrop: 'Ekin qo‘shish',
heroTitle: 'Har bir maydon — yangi imkoniyat.',
heroDescription: 'Ma’lumotlarga asoslangan qarorlar bilan hosilingizni samarali boshqaring.',
viewFields: 'Maydonlarni ko‘rish',
totalCrops: 'Jami ekinlar',
varieties: 'tur',
activeList: 'Faol ro‘yxat',
cropArea: 'Ekin maydoni',
hectare: 'ga',
fertilizerStatusUpdated: 'O‘g‘itlash holati yangilandi.',
fertilizerStatusUpdateError: 'Holatni yangilashda xatolik: ',
totalAreaEntered: 'Jami kiritilgan maydon',
irrigationStatus: 'Sug‘orish holati',
fertilizerStatus: 'O‘g‘itlash holati',
completedIrrigationShare: 'Bajarilgan sug‘orish rejalarining ulushi',
completedFertilizerShare: 'Bajarilgan o‘g‘itlash rejalarining ulushi',
todayStatus: 'BUGUNGI HOLAT',
weather: 'Ob-havo',
loadingWeather: 'Ob-havo ma’lumotlari yuklanmoqda...',
humidity: 'Namlik',
wind: 'Shamol',
feelsLike: 'His qilinadigan',
sevenDayForecast: '7 kunlik prognoz',
today: 'Bugun',
search: 'Qidirish...',
fertilizerPlansTitle: 'O‘g‘itlash rejalari',
manageFertilizer: 'Maydonlaringiz uchun o‘g‘itlash ishlarini rejalashtiring.',
fertilizerEditNotFound: 'Tahrirlash uchun reja topilmadi.',
fertilizerUpdated: 'O‘g‘itlash rejasi yangilandi.',
fertilizerUpdateError: 'Yangilashda xatolik: ',
fertilizerType: 'O‘g‘it turi',
chooseFertilizer: 'O‘g‘it turini tanlang',
nitrogenFertilizer: 'Azotli o‘g‘it',
phosphorusFertilizer: 'Fosforli o‘g‘it',
potassiumFertilizer: 'Kaliyli o‘g‘it',
organicFertilizer: 'Organik o‘g‘it',
complexFertilizer: 'Kompleks o‘g‘it',
fertilizerAmount: 'O‘g‘it miqdori (kg)',
fertilizerAmountPlaceholder: 'Masalan, 50',
fertilizerDate: 'O‘g‘itlash sanasi',
fertilizerTime: 'O‘g‘itlash vaqti',
fertilizerNotePlaceholder: 'Qo‘shimcha ma’lumot',
fertilizerColumn: 'O‘g‘it turi',
amountColumn: 'Miqdori (kg)',
noFertilizerPlans: 'Hozircha o‘g‘itlash rejasi yo‘q.',
confirmDeleteFertilizer: 'Ushbu o‘g‘itlash rejasini o‘chirmoqchimisiz?',
fertilizerDeleted: 'O‘g‘itlash rejasi o‘chirildi.',
fertilizerDeleteError: 'O‘chirishda xatolik: ',
weatherUnavailable: 'Ob-havo ma’lumoti mavjud emas.',
refreshData: 'Ma’lumotni yangilash',
statusAbout: 'Holat haqida',
farm: 'XO‘JALIK',
activeCrops: 'Faol ekinlar',
irrigationRequiredFields: 'Barcha majburiy maydonlarni to‘ldiring.',
loginAgain: 'Qayta tizimga kiring.',
fertilizerSaved: 'O‘g‘itlash rejasi muvaffaqiyatli qo‘shildi.',
fertilizerSaveError: 'Saqlashda xatolik: ',
all: 'Barchasi',
hectare: 'ga',
cropType: 'Ekin turi',
area: 'Maydon',
irrigationUpdated: 'Sug‘orish rejasi yangilandi.',
irrigationUpdateError: 'Yangilashda xatolik: ',
plantedDate: 'Ekilgan sana',
growthStage: 'Rivojlanish bosqichi',
notEntered: 'Kiritilmagan',
growing: 'O‘sish jarayonida',
plan: 'REJA',
todaysTasks: 'Bugungi vazifalar',
noTasksToday: 'Bugun uchun rejalashtirilgan vazifalar yo‘q.',
openCalendar: 'Kalendarni ochish',
    crops: 'Ekinlar',
    cropUpdated: 'Ekin ma’lumotlari muvaffaqiyatli yangilandi.',
cropEditError: 'Tahrirlashda xatolik: ',
    cropSectionEyebrow: 'XO‘JALIK MA’LUMOTLARI',
cropListTitle: 'Ekinlar ro‘yxati',
addCropButton: 'Ekin qo‘shish',
cropNameLabel: 'Ekin nomi',
cropAreaLabel: 'Maydon (gektar)',
cropPlantedDate: 'Ekilgan sana',
cropStageLabel: 'Rivojlanish bosqichi',
cropPlaceholder: 'Masalan, Bug‘doy',
cropSaving: 'Saqlanmoqda...',
cropSave: 'Saqlash',
cropEditTitle: 'Ekin ma’lumotlarini tahrirlash',
cropSaveChanges: 'O‘zgarishlarni saqlash',
cropCancel: 'Bekor qilish',
cropTableType: 'Ekin turi',
cropTableArea: 'Maydon',
cropTableStatus: 'Holati',
cropTableActions: 'Amallar',
cropEdit: 'Tahrirlash',
cropDelete: 'O‘chirish',
stagePreparing: 'Ekishga tayyorlanmoqda',
stagePlanted: 'Ekildi',
stageSprouted: 'Unib chiqdi',
stageGrowing: 'O‘sish jarayonida',
stageFlowering: 'Gullash bosqichi',
stageForming: 'Hosil shakllanmoqda',
stageReady: 'Hosilga tayyor',
stageHarvested: 'Hosil yig‘ildi',
newField: 'Yangi maydon',
    fields: 'Maydonlar',
    myFields: 'Maydonlarim',
    confirmDeleteField: 'Bu maydonni o‘chirishni xohlaysizmi?',
fieldDeleted: 'Maydon muvaffaqiyatli o‘chirildi.',
fieldDeleteError: 'O‘chirishda xatolik: ',
    fillAllFields: 'Barcha maydonlarni to‘g‘ri to‘ldiring.',
loginAgain: 'Qayta tizimga kiring.',
fieldSaved: 'Maydon muvaffaqiyatli saqlandi.',
fieldSaveError: 'Maydonni saqlashda xatolik: ',
manageFields: 'Fermer xo‘jaligingiz maydonlarini boshqaring.',
fieldUpdated: 'Maydon muvaffaqiyatli yangilandi.',
fieldUpdateError: 'Yangilashda xatolik: ',
addField: 'Maydon qo‘shish',
fieldName: 'Maydon nomi',
fieldPlaceholder: 'Masalan, 1-maydon',
irrigationRequiredFields: 'Barcha majburiy maydonlarni to‘ldiring.',
irrigationSaved: 'Sug‘orish rejasi muvaffaqiyatli saqlandi.',
irrigationSaveError: 'Sug‘orish rejasini saqlashda xatolik: ',
fieldSize: 'Maydon hajmi (gektar)',
soilType: 'Tuproq turi',
saveField: 'Maydonni saqlash',
fieldNameColumn: 'Maydon nomi',
fieldSizeColumn: 'Hajmi',
soilColumn: 'Tuproq turi',
noFields: 'Hozircha maydon qo‘shilmagan.',
blackSoil: 'Qora tuproq',
graySoil: 'Bo‘z tuproq',
sandySoil: 'Qumloq tuproq',
salineSoil: 'Sho‘rlangan tuproq',
otherSoil: 'Boshqa',
    irrigation: 'Sug‘orish',
    irrigationStatusPlanned: 'Rejalashtirilgan',
irrigationStatusProgress: 'Jarayonda',
irrigationStatusCompleted: 'Bajarildi',
completeIrrigation: 'Yakunlandi',
    fertilizer: 'O‘g‘itlash',
    calendar: 'Kalendar',
    calendarEyebrow: 'REJALASHTIRISH',
calendarTitle: 'Dehqonchilik kalendari',
previousMonth: 'Oldingi oy',
nextMonth: 'Keyingi oy',
calendarTasks: 'Vazifalar',
noCalendarTasks: 'Bu kun uchun rejalashtirilgan vazifalar yo‘q.',
edit: 'Tahrirlash',
delete: 'O‘chirish',
irrigation: 'Sug‘orish',
monday: 'Du',
tuesday: 'Se',
wednesday: 'Cho',
thursday: 'Pay',
friday: 'Ju',
saturday: 'Sha',
sunday: 'Ya',
planned: 'Rejalashtirilgan',
inProgress: 'Jarayonda',
completed: 'Bajarildi',
    notifications: 'Bildirishnomalar',
    irrigationPlansTitle: 'Sug‘orish rejalari',
manageIrrigation: 'Maydonlar uchun sug‘orish ishlarini rejalashtiring.',
addPlan: 'Reja qo‘shish',
selectField: 'Maydonni tanlang',
chooseField: 'Maydonni tanlang',
irrigationDate: 'Sug‘orish sanasi',
irrigationTime: 'Sug‘orish vaqti',
waterAmount: 'Suv miqdori (m³)',
waterPlaceholder: 'Masalan, 25',
optionalNote: 'Izoh (ixtiyoriy)',
irrigationNotePlaceholder: 'Masalan, ertalab sug‘orish',
saveChanges: 'O‘zgarishlarni saqlash',
savePlan: 'Rejani saqlash',
addFieldFirst: 'Avval Maydonlar bo‘limida maydon qo‘shing.',
fieldColumn: 'Maydon',
dateColumn: 'Sana',
timeColumn: 'Vaqt',
waterColumn: 'Suv (m³)',
statusColumn: 'Holati',
noteColumn: 'Izoh',
actionsColumn: 'Amallar',
fieldNotFound: 'Maydon topilmadi',
completed: 'Yakunlandi',
noIrrigationPlans: 'Hozircha sug‘orish rejasi yo‘q.',
    notificationsDescription: 'Fermer xo‘jaligingizdagi yangiliklar va eslatmalar',
    new: 'ta yangi',
markAllRead: 'Barchasini o‘qilgan deb belgilash',
deleteAll: 'Hammasini o‘chirish',
notificationsLoading: 'Bildirishnomalar yuklanmoqda...',
noNotifications: 'Hozircha bildirishnomalar yo‘q',
newMessagesHere: 'Yangi xabarlar shu yerda ko‘rinadi.',
markAsRead: 'O‘qilgan deb belgilash',
deleteNotification: 'Bildirishnomani o‘chirish',
totalNotifications: 'Jami bildirishnomalar',
unread: 'O‘qilmagan',
read: 'O‘qilgan',
    profile: 'Profil',
    personalProfile: 'Shaxsiy profil',
profileDescription: 'Shaxsiy va fermer xo‘jaligingiz haqidagi ma’lumotlar',
profileLoading: 'Profil yuklanmoqda...',
profilePhoto: 'Profil rasmi',
changePhoto: 'Rasmni o‘zgartirish',
fullName: 'Ism va familiya',
email: 'Email',
phone: 'Telefon',
farmName: 'Xo‘jalik nomi',
location: 'Joylashuv',
notProvided: 'Kiritilmagan',
editInformation: 'Ma’lumotlarni tahrirlash',
enterFullName: 'Ism va familiyangiz',
enterFarmName: 'Xo‘jalik nomi',
enterLocation: 'Viloyat, tuman, mahalla',
    settings: 'Sozlamalar',
    logout: 'Chiqish',
    settingsDescription: 'Hisobingiz va ilova sozlamalarini boshqaring.',
    passwordSecurity: 'Parol xavfsizligi',
    passwordDescription: 'Hisobingiz xavfsizligi uchun parolingizni yangilashingiz mumkin.',
    saving: 'Saqlanmoqda...',
saveChanges: 'O‘zgarishlarni saqlash',
cancel: 'Bekor qilish',
    settings: 'Sozlamalar',
settingsDescription: 'Hisobingiz va ilova sozlamalarini boshqaring.',
    notificationSettings: 'Bildirishnoma sozlamalari',
    notificationDescription: 'Qaysi eslatmalarni olishni xohlayotganingizni tanlang.',
irrigationReminders: 'Sug‘orish haqida eslatmalar',
fertilizerReminders: 'O‘g‘itlash haqida eslatmalar',
    languageSettings: 'Til sozlamalari',
    languageDescription: 'Ilovadan foydalanish uchun tilni tanlang.',
    themeSettings: 'Mavzu sozlamalari',
    themeDescription: 'Ilova ko‘rinishini o‘zingizga moslang.',
    changePassword: 'Parolni o‘zgartirish',
    darkMode: 'Qorong‘i rejim',
    lightMode: 'Yorug‘ rejim',
    uzbek: 'O‘zbekcha',
    russian: 'Ruscha',
    english: 'Inglizcha'
  },

  ru: {
    dashboard: 'Панель управления',
    farmerCabinet: 'кабинет фермера',
welcome: 'Добро пожаловать',
dashboardIntro: 'Ознакомьтесь с состоянием вашего хозяйства сегодня.',
addCrop: 'Добавить культуру',
heroTitle: 'Каждое поле — новая возможность.',
heroDescription: 'Эффективно управляйте урожаем с помощью решений на основе данных.',
viewFields: 'Посмотреть поля',
totalCrops: 'Всего культур',
varieties: 'вида',
activeList: 'Активный список',
cropArea: 'Площадь посевов',
hectare: 'га',
totalAreaEntered: 'Общая указанная площадь',
irrigationStatus: 'Состояние полива',
fertilizerStatus: 'Состояние удобрения',
completedIrrigationShare: 'Доля выполненных планов полива',
completedFertilizerShare: 'Доля выполненных планов удобрения',
todayStatus: 'СЕГОДНЯШНЕЕ СОСТОЯНИЕ',
weather: 'Погода',
loadingWeather: 'Загрузка данных о погоде...',
humidity: 'Влажность',
wind: 'Ветер',
feelsLike: 'Ощущается как',
sevenDayForecast: 'Прогноз на 7 дней',
today: 'Сегодня',
weatherUnavailable: 'Данные о погоде недоступны.',
refreshData: 'Обновить данные',
statusAbout: 'О состоянии',
farm: 'ХОЗЯЙСТВО',
activeCrops: 'Активные культуры',
all: 'Все',
cropType: 'Тип культуры',
area: 'Площадь',
plantedDate: 'Дата посадки',
growthStage: 'Стадия развития',
notEntered: 'Не указано',
growing: 'В процессе роста',
plan: 'ПЛАН',
todaysTasks: 'Задачи на сегодня',
fertilizerStatusUpdated: 'Статус внесения удобрений обновлён.',
fertilizerStatusUpdateError: 'Ошибка при обновлении статуса: ',
irrigationUpdated: 'План полива обновлён.',
irrigationUpdateError: 'Ошибка при обновлении: ',
noTasksToday: 'На сегодня задач не запланировано.',
openCalendar: 'Открыть календарь',
    crops: 'Культуры',
    newField: 'Новое поле',
    fillAllFields: 'Правильно заполните все поля.',
loginAgain: 'Войдите в систему повторно.',
confirmDeleteFertilizer: 'Вы действительно хотите удалить этот план внесения удобрений?',
fertilizerDeleted: 'План внесения удобрений удалён.',
fertilizerDeleteError: 'Ошибка при удалении: ',
fieldSaved: 'Поле успешно сохранено.',
fieldSaveError: 'Ошибка при сохранении поля: ',
    cropSectionEyebrow: 'ДАННЫЕ ХОЗЯЙСТВА',
cropListTitle: 'Список культур',
addCropButton: 'Добавить культуру',
cropNameLabel: 'Название культуры',
cropAreaLabel: 'Площадь (гектар)',
cropPlantedDate: 'Дата посадки',
irrigationRequiredFields: 'Заполните все обязательные поля.',
irrigationSaved: 'План полива успешно сохранён.',
irrigationSaveError: 'Ошибка при сохранении плана полива: ',
irrigationRequiredFields: 'Заполните все обязательные поля.',
loginAgain: 'Войдите в систему повторно.',
fertilizerSaved: 'План внесения удобрений успешно добавлен.',
fertilizerSaveError: 'Ошибка при сохранении: ',
cropStageLabel: 'Стадия развития',
cropPlaceholder: 'Например, Пшеница',
cropSaving: 'Сохранение...',
cropSave: 'Сохранить',
cropEditTitle: 'Редактирование данных культуры',
cropSaveChanges: 'Сохранить изменения',
cropCancel: 'Отмена',
cropUpdated: 'Данные о культуре успешно обновлены.',
cropEditError: 'Ошибка при редактировании: ',
cropTableType: 'Тип культуры',
hectare: 'га',
cropTableArea: 'Площадь',
cropTableStatus: 'Статус',
cropTableActions: 'Действия',
cropEdit: 'Редактировать',
cropDelete: 'Удалить',
stagePreparing: 'Подготовка к посеву',
stagePlanted: 'Посажено',
stageSprouted: 'Появились всходы',
search: 'Поиск...',
stageGrowing: 'В процессе роста',
stageFlowering: 'Стадия цветения',
stageForming: 'Формирование урожая',
stageReady: 'Готово к сбору',
stageHarvested: 'Урожай собран',
    fields: 'Поля',
    myFields: 'Мои поля',
manageFields: 'Управляйте полями вашего фермерского хозяйства.',
fieldUpdated: 'Поле успешно обновлено.',
fieldUpdateError: 'Ошибка при обновлении: ',
addField: 'Добавить поле',
fieldName: 'Название поля',
confirmDeleteField: 'Вы хотите удалить это поле?',
fieldDeleted: 'Поле успешно удалено.',
fieldDeleteError: 'Ошибка при удалении: ',
fieldPlaceholder: 'Например, Поле 1',
fieldSize: 'Площадь поля (гектары)',
soilType: 'Тип почвы',
saveField: 'Сохранить поле',
fieldNameColumn: 'Название поля',
fieldSizeColumn: 'Площадь',
soilColumn: 'Тип почвы',
noFields: 'Пока поля не добавлены.',
blackSoil: 'Чернозём',
graySoil: 'Серая почва',
sandySoil: 'Песчаная почва',
salineSoil: 'Засоленная почва',
otherSoil: 'Другое',
    irrigation: 'Орошение',
    irrigationStatusPlanned: 'Запланировано',
irrigationStatusProgress: 'В процессе',
irrigationStatusCompleted: 'Выполнено',
completeIrrigation: 'Завершить',
    irrigationPlansTitle: 'Планы полива',
manageIrrigation: 'Планируйте полив сельскохозяйственных полей.',
fertilizerEditNotFound: 'План для редактирования не найден.',
fertilizerUpdated: 'План внесения удобрений обновлён.',
fertilizerUpdateError: 'Ошибка при обновлении: ',
addPlan: 'Добавить план',
selectField: 'Выберите поле',
chooseField: 'Выберите поле',
irrigationDate: 'Дата полива',
irrigationTime: 'Время полива',
waterAmount: 'Количество воды (м³)',
waterPlaceholder: 'Например, 25',
optionalNote: 'Примечание (необязательно)',
irrigationNotePlaceholder: 'Например, утренний полив',
saveChanges: 'Сохранить изменения',
savePlan: 'Сохранить план',
addFieldFirst: 'Сначала добавьте поле в разделе «Поля».',
fieldColumn: 'Поле',
dateColumn: 'Дата',
timeColumn: 'Время',
waterColumn: 'Вода (м³)',
statusColumn: 'Статус',
noteColumn: 'Примечание',
actionsColumn: 'Действия',
fieldNotFound: 'Поле не найдено',
completed: 'Завершено',
noIrrigationPlans: 'Пока нет планов полива.',
    fertilizer: 'Удобрение',
    calendar: 'Календарь',
    calendarEyebrow: 'ПЛАНИРОВАНИЕ',
calendarTitle: 'Календарь земледелия',
previousMonth: 'Предыдущий месяц',
nextMonth: 'Следующий месяц',
calendarTasks: 'Задачи',
fertilizerPlansTitle: 'Планы внесения удобрений',
manageFertilizer: 'Планируйте внесение удобрений на своих полях.',
fertilizerType: 'Тип удобрения',
chooseFertilizer: 'Выберите тип удобрения',
nitrogenFertilizer: 'Азотное удобрение',
phosphorusFertilizer: 'Фосфорное удобрение',
potassiumFertilizer: 'Калийное удобрение',
organicFertilizer: 'Органическое удобрение',
complexFertilizer: 'Комплексное удобрение',
fertilizerAmount: 'Количество удобрения (кг)',
fertilizerAmountPlaceholder: 'Например, 50',
fertilizerDate: 'Дата внесения удобрения',
fertilizerTime: 'Время внесения удобрения',
fertilizerNotePlaceholder: 'Дополнительная информация',
fertilizerColumn: 'Тип удобрения',
amountColumn: 'Количество (кг)',
noFertilizerPlans: 'Пока нет планов внесения удобрений.',
noCalendarTasks: 'На этот день задач не запланировано.',
edit: 'Редактировать',
delete: 'Удалить',
irrigation: 'Полив',
monday: 'Пн',
tuesday: 'Вт',
wednesday: 'Ср',
thursday: 'Чт',
friday: 'Пт',
saturday: 'Сб',
sunday: 'Вс',
planned: 'Запланировано',
inProgress: 'В процессе',
completed: 'Выполнено',
    notifications: 'Уведомления',
    notificationsDescription: 'Новости и напоминания вашего фермерского хозяйства',
    new: 'новых',
markAllRead: 'Отметить все как прочитанные',
deleteAll: 'Удалить все',
notificationsLoading: 'Загрузка уведомлений...',
noNotifications: 'Пока нет уведомлений',
newMessagesHere: 'Новые сообщения будут отображаться здесь.',
markAsRead: 'Отметить как прочитанное',
deleteNotification: 'Удалить уведомление',
    profile: 'Профиль',
    personalProfile: 'Личный профиль',
profileDescription: 'Личная информация и сведения о вашем фермерском хозяйстве',
totalNotifications: 'Всего уведомлений',
unread: 'Непрочитанные',
read: 'Прочитанные',
profileLoading: 'Загрузка профиля...',
profilePhoto: 'Фото профиля',
changePhoto: 'Изменить фото',
fullName: 'Имя и фамилия',
email: 'Электронная почта',
phone: 'Телефон',
farmName: 'Название хозяйства',
location: 'Местоположение',
notProvided: 'Не указано',
editInformation: 'Редактировать информацию',
enterFullName: 'Ваше имя и фамилия',
enterFarmName: 'Название хозяйства',
enterLocation: 'Область, район, махалля',
saving: 'Сохранение...',
saveChanges: 'Сохранить изменения',
cancel: 'Отмена',
    settings: 'Настройки',
    logout: 'Выйти',
    settingsDescription: 'Управляйте настройками аккаунта и приложения.',
    passwordSecurity: 'Безопасность пароля',
    passwordDescription: 'Вы можете обновить пароль для безопасности своей учётной записи.',
    settings: 'Настройки',
settingsDescription: 'Управляйте настройками аккаунта и приложения.',
    notificationSettings: 'Настройки уведомлений',
    notificationDescription: 'Выберите, какие напоминания хотите получать.',
irrigationReminders: 'Напоминания о поливе',
fertilizerReminders: 'Напоминания об удобрении',
    languageSettings: 'Настройки языка',
    languageDescription: 'Выберите язык для использования приложения.',
    themeSettings: 'Настройки темы',
    themeDescription: 'Настройте внешний вид приложения под себя.',
    changePassword: 'Изменить пароль',
    darkMode: 'Тёмный режим',
    lightMode: 'Светлый режим',
    uzbek: 'Узбекский',
    russian: 'Русский',
    english: 'Английский'
  },

  en: {
    dashboard: 'Dashboard',
    farmerCabinet: 'farmer dashboard',
welcome: 'Welcome',
dashboardIntro: 'Check the status of your farm today.',
addCrop: 'Add crop',
heroTitle: 'Every field is a new opportunity.',
heroDescription: 'Manage your harvest efficiently with data-driven decisions.',
viewFields: 'View fields',
totalCrops: 'Total crops',
varieties: 'types',
activeList: 'Active list',
cropArea: 'Crop area',
hectare: 'ha',
totalAreaEntered: 'Total registered area',
irrigationStatus: 'Irrigation status',
fertilizerStatus: 'Fertilization status',
completedIrrigationShare: 'Share of completed irrigation plans',
completedFertilizerShare: 'Share of completed fertilization plans',
todayStatus: 'TODAY’S STATUS',
weather: 'Weather',
loadingWeather: 'Loading weather data...',
humidity: 'Humidity',
wind: 'Wind',
feelsLike: 'Feels like',
sevenDayForecast: '7-day forecast',
today: 'Today',
weatherUnavailable: 'Weather information is unavailable.',
refreshData: 'Refresh data',
statusAbout: 'About status',
farm: 'FARM',
activeCrops: 'Active crops',
all: 'All',
cropType: 'Crop type',
area: 'Area',
plantedDate: 'Planting date',
growthStage: 'Growth stage',
notEntered: 'Not entered',
growing: 'Growing',
plan: 'PLAN',
todaysTasks: 'Today’s tasks',
noTasksToday: 'No tasks are scheduled for today.',
openCalendar: 'Open calendar',
    crops: 'Crops',
    cropSectionEyebrow: 'FARM INFORMATION',
cropListTitle: 'Crop list',
addCropButton: 'Add crop',
cropNameLabel: 'Crop name',
hectare: 'ha',
cropAreaLabel: 'Area (hectares)',
cropPlantedDate: 'Planting date',
cropStageLabel: 'Growth stage',
cropPlaceholder: 'For example, Wheat',
cropSaving: 'Saving...',
cropSave: 'Save',
cropUpdated: 'Crop information updated successfully.',
cropEditError: 'Error while editing: ',
cropEditTitle: 'Edit crop information',
search: 'Search...',
cropSaveChanges: 'Save changes',
cropCancel: 'Cancel',
cropTableType: 'Crop type',
cropTableArea: 'Area',
cropTableStatus: 'Status',
cropTableActions: 'Actions',
irrigationUpdated: 'Irrigation plan updated.',
irrigationUpdateError: 'Error updating irrigation plan: ',
cropEdit: 'Edit',
cropDelete: 'Delete',
stagePreparing: 'Preparing for planting',
fertilizerStatusUpdated: 'Fertilization status updated.',
fertilizerStatusUpdateError: 'Error updating status: ',
stagePlanted: 'Planted',
irrigationRequiredFields: 'Please fill in all required fields.',
irrigationSaved: 'Irrigation plan saved successfully.',
irrigationSaveError: 'Error saving irrigation plan: ',
stageSprouted: 'Sprouted',
stageGrowing: 'Growing',
stageFlowering: 'Flowering stage',
stageForming: 'Fruit formation',
confirmDeleteFertilizer: 'Are you sure you want to delete this fertilization plan?',
fertilizerDeleted: 'Fertilization plan deleted.',
fertilizerDeleteError: 'Error deleting the plan: ',
stageReady: 'Ready for harvest',
stageHarvested: 'Harvested',
newField: 'New field',
fertilizerPlansTitle: 'Fertilization plans',
manageFertilizer: 'Plan fertilization activities for your fields.',
fertilizerType: 'Fertilizer type',
chooseFertilizer: 'Select fertilizer type',
nitrogenFertilizer: 'Nitrogen fertilizer',
phosphorusFertilizer: 'Phosphorus fertilizer',
potassiumFertilizer: 'Potassium fertilizer',
organicFertilizer: 'Organic fertilizer',
complexFertilizer: 'Complex fertilizer',
fertilizerEditNotFound: 'The plan to edit was not found.',
fertilizerUpdated: 'Fertilization plan updated.',
fertilizerUpdateError: 'Error updating the plan: ',
fertilizerAmount: 'Fertilizer amount (kg)',
fertilizerAmountPlaceholder: 'For example, 50',
fertilizerDate: 'Fertilization date',
fertilizerTime: 'Fertilization time',
fertilizerNotePlaceholder: 'Additional information',
fertilizerColumn: 'Fertilizer type',
amountColumn: 'Amount (kg)',
noFertilizerPlans: 'There are no fertilization plans yet.',
    fields: 'Fields',
    myFields: 'My fields',
    irrigationStatusPlanned: 'Planned',
irrigationStatusProgress: 'In progress',
irrigationStatusCompleted: 'Completed',
completeIrrigation: 'Complete',
    fieldUpdated: 'Field updated successfully.',
fieldUpdateError: 'Error updating field: ',
    fillAllFields: 'Please fill in all fields correctly.',
loginAgain: 'Please log in again.',
fieldSaved: 'Field saved successfully.',
fieldSaveError: 'Error saving field: ',
manageFields: 'Manage your farm fields.',
addField: 'Add field',
fieldName: 'Field name',
fieldPlaceholder: 'For example, Field 1',
fieldSize: 'Field area (hectares)',
confirmDeleteField: 'Do you want to delete this field?',
fieldDeleted: 'Field deleted successfully.',
fieldDeleteError: 'Error deleting field: ',
soilType: 'Soil type',
saveField: 'Save field',
irrigationRequiredFields: 'Please fill in all required fields.',
loginAgain: 'Please log in again.',
fertilizerSaved: 'Fertilization plan added successfully.',
fertilizerSaveError: 'Error saving: ',
fieldNameColumn: 'Field name',
fieldSizeColumn: 'Area',
soilColumn: 'Soil type',
noFields: 'No fields have been added yet.',
blackSoil: 'Chernozem soil',
graySoil: 'Gray soil',
sandySoil: 'Sandy soil',
salineSoil: 'Saline soil',
otherSoil: 'Other',
    irrigation: 'Irrigation',
    fertilizer: 'Fertilization',
    calendar: 'Calendar',
    calendarEyebrow: 'PLANNING',
calendarTitle: 'Farming Calendar',
previousMonth: 'Previous month',
nextMonth: 'Next month',
calendarTasks: 'Tasks',
noCalendarTasks: 'No tasks are scheduled for this day.',
edit: 'Edit',
delete: 'Delete',
irrigation: 'Irrigation',
monday: 'Mon',
tuesday: 'Tue',
wednesday: 'Wed',
thursday: 'Thu',
friday: 'Fri',
saturday: 'Sat',
sunday: 'Sun',
planned: 'Planned',
inProgress: 'In progress',
completed: 'Completed',

    notifications: 'Notifications',
    irrigationPlansTitle: 'Irrigation plans',
manageIrrigation: 'Plan irrigation activities for your fields.',
addPlan: 'Add plan',
selectField: 'Select a field',
chooseField: 'Select a field',
irrigationDate: 'Irrigation date',
irrigationTime: 'Irrigation time',
waterAmount: 'Water amount (m³)',
waterPlaceholder: 'For example, 25',
optionalNote: 'Note (optional)',
irrigationNotePlaceholder: 'For example, morning irrigation',
saveChanges: 'Save changes',
savePlan: 'Save plan',
addFieldFirst: 'First add a field in the Fields section.',
fieldColumn: 'Field',
dateColumn: 'Date',
timeColumn: 'Time',
waterColumn: 'Water (m³)',
statusColumn: 'Status',
noteColumn: 'Note',
actionsColumn: 'Actions',
fieldNotFound: 'Field not found',
completed: 'Completed',
noIrrigationPlans: 'There are no irrigation plans yet.',
    notificationsDescription: 'News and reminders from your farm',
    new: 'new',
markAllRead: 'Mark all as read',
deleteAll: 'Delete all',
notificationsLoading: 'Loading notifications...',
noNotifications: 'No notifications yet',
newMessagesHere: 'New messages will appear here.',
markAsRead: 'Mark as read',
deleteNotification: 'Delete notification',
totalNotifications: 'Total notifications',
unread: 'Unread',
read: 'Read',
    profile: 'Profile',
    personalProfile: 'Personal profile',
profileDescription: 'Personal and farm information',
profileLoading: 'Loading profile...',
profilePhoto: 'Profile photo',
changePhoto: 'Change photo',
fullName: 'Full name',
email: 'Email',
phone: 'Phone',
farmName: 'Farm name',
location: 'Location',
notProvided: 'Not provided',
editInformation: 'Edit information',
enterFullName: 'Your full name',
enterFarmName: 'Farm name',
enterLocation: 'Region, district, neighborhood',
    settings: 'Settings',
    logout: 'Log out',
    settingsDescription: 'Manage your account and application settings.',
    passwordSecurity: 'Password security',
    passwordDescription: 'You can update your password to keep your account secure.',
    saving: 'Saving...',
saveChanges: 'Save changes',
cancel: 'Cancel',
    settings: 'Settings',
settingsDescription: 'Manage your account and application settings.',
    notificationSettings: 'Notification settings',
    notificationDescription: 'Choose which reminders you would like to receive.',
irrigationReminders: 'Irrigation reminders',
fertilizerReminders: 'Fertilizer reminders',
    languageSettings: 'Language settings',
    languageDescription: 'Choose the language you want to use in the application.',
    themeSettings: 'Theme settings',
    themeDescription: 'Customize the appearance of the application.',
    changePassword: 'Change password',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    uzbek: 'Uzbek',
    russian: 'Russian',
    english: 'English'
  }
}

const t = (key) => translations[appLanguage]?.[key] || translations.uz[key] || key
  return (
   <div className={`farm-app ${darkTheme ? 'farm-dark-theme' : ''}`}>
      {mobileMenu && (
        <button
          className="farm-mobile-overlay"
          aria-label="Menyuni yopish"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`farm-sidebar ${mobileMenu ? 'farm-sidebar-open' : ''}`}>
        <div className="farm-brand">
          <span className="farm-brand-icon">
  <Leaf size={29} strokeWidth={1.7} />
</span>
          <span>SmartFarm <small>PLANNER</small></span>
          <button className="farm-close-menu" onClick={() => setMobileMenu(false)} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>


        <p className="farm-nav-caption">ASOSIY MENYU</p>
        <nav className="farm-nav">
          {menuItems.map(({ label, translation, icon: Icon }) => (
  <button
    key={label}
    className={`farm-nav-item ${active === label ? 'active' : ''}`}
    onClick={() => {
      setActive(label)
      setMobileMenu(false)
      setNotice('')
    }}
  >
    <Icon size={19} strokeWidth={1.8} />
    <span>{t(translation)}</span>

    {label === 'Bildirishnomalar' &&
      notifications.filter((item) => !item.is_read).length > 0 && (
        <span className="farm-nav-count">
          {notifications.filter((item) => !item.is_read).length}
        </span>
      )}
  </button>
))}
</nav>

        <div className="farm-sidebar-bottom">
         <button
  className="farm-nav-item farm-settings"
  onClick={() => setActive('Sozlamalar')}
>
  <Settings size={19} />
  <span>{t('settings')}</span>
</button>
          <button className="farm-logout" onClick={logout}>
  <LogOut size={18} />
  {t('logout')}
</button>
        </div>
      </aside>

      <main className="farm-main">
        <header className="farm-topbar">
          <button className="farm-menu-button" onClick={() => setMobileMenu(true)} aria-label="Menyuni ochish">
            <Menu size={22} />
          </button>
          <div className="farm-breadcrumb">
  SmartFarm <span>/</span>{' '}
  {t(
    menuItems.find((item) => item.label === active)?.translation ||
    (active === 'Profil' ? 'profile' : 'settings')
  )}
</div>
          <div className="farm-topbar-actions">
            <div className="farm-search">
              <Search size={17} />
             <input
  aria-label={t('search')}
  placeholder={t('search')}
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
              
            </div>
           <button
  className="farm-notification-button"
  onClick={() => setActive('Bildirishnomalar')}
  aria-label="Bildirishnomalar"
>
  <Bell size={19} />
  {notifications.some((notification) => !notification.is_read) && <i />}
</button>
            <button
  className="farm-top-avatar"
  onClick={() => setActive('Profil')}
  aria-label="Profil"
  title="Profil"
>
  {firstName.charAt(0).toUpperCase()}
</button>
          </div>
          {searchQuery.trim() && (
  <div className="farm-search-results">
    <div className="farm-search-results-heading">
      <strong>Qidiruv natijalari</strong>
      <span>{searchResults.length} ta natija</span>
    </div>

    {searchResults.length > 0 ? (
      searchResults.map((item) => (
        <button
          key={`${item.searchType}-${item.id}`}
          className="farm-search-result"
          onClick={() => {
            const target = {
              crop: 'Ekinlar',
              field: 'Maydonlar',
              irrigation: 'Sug‘orish',
              fertilizer: 'O‘g‘itlash',
            }[item.searchType]

            setActive(target)
            setSearchQuery('')
          }}
        >
          <Search size={15} />
          <span>{item.searchName}</span>
          <small>
            {{
              crop: 'Ekin',
              field: 'Maydon',
              irrigation: 'Sug‘orish',
              fertilizer: 'O‘g‘itlash',
            }[item.searchType]}
          </small>
        </button>
      ))
    ) : (
      <p>Hech qanday natija topilmadi.</p>
    )}
  </div>
)}
        </header>

        <div className="farm-content">
          {notice && (
            <div className="farm-notice">
              <CheckCircle2 size={18} /> {notice}
              <button onClick={() => setNotice('')} aria-label="Yopish"><X size={16} /></button>
            </div>
          )}

          {active === 'Boshqaruv paneli' ? (
            <>
              <section className="farm-welcome">
                <div>
                  <div className="farm-date">
  <CalendarDays size={15} /> 2026 — {t('farmerCabinet')}
</div>
                  <h1>{t('welcome')}, {firstName}! <span></span></h1>
<p>{t('dashboardIntro')}</p>
                </div>
                <button className="farm-primary-button" onClick={() => { setActive('Ekinlar'); setShowCropForm(true) }}>
                  <Plus size={18} /> {t('addCrop')}
                </button>
              </section>

              <section className="farm-hero-banner">
                <div className="farm-hero-copy">
                  <span className="farm-hero-tag"><Sprout size={14} /> SMART FARMING</span>
<h2>{t('heroTitle')}</h2>
<p>{t('heroDescription')}</p>
<button onClick={() => setActive('Maydonlar')}>
  {t('viewFields')} <ArrowUpRight size={17} />
</button>
                </div>
                <div className="farm-hero-image" role="img" aria-label="Yashil dehqonchilik dalasi" />
              </section>

              <section className="farm-stats-grid">
                <article className="farm-stat-card">
                  <div className="farm-stat-top"><span className="farm-stat-icon green"><Sprout size={20} /></span><span className="farm-stat-label">{t('totalCrops')}</span></div>
                  <div className="farm-stat-value">{crops.length} <small>	{t('varieties')}</small></div>
                  <div className="farm-stat-foot"><span><TrendingUp size={14} /> {t('activeList')}</span><span></span></div>
                </article>
                <article className="farm-stat-card">
                  <div className="farm-stat-top"><span className="farm-stat-icon blue"><Map size={20} /></span><span className="farm-stat-label">{t('cropArea')}</span></div>
                  <div className="farm-stat-value">{totalArea} <small>{t('hectare')}</small></div>
                  <div className="farm-stat-foot"><span>{t('totalAreaEntered')}</span><span></span></div>
                </article>
                <article className="farm-stat-card">
  <div className="farm-stat-top">
    <span className="farm-stat-icon aqua">
      <Droplets size={20} />
    </span>
    <span className="farm-stat-label">{t('irrigationStatus')}</span>
  </div>

  <div className="farm-stat-value">
    {irrigationProgress}<small>%</small>
  </div>

  <div className="farm-progress">
    <span style={{ width: `${irrigationProgress}%` }} />
  </div>

  <div className="farm-stat-foot">
    <span>{t('completedIrrigationShare')}</span>
    <span></span>
  </div>
</article>
<article className="farm-stat-card">
  <div className="farm-stat-top">
    <span className="farm-stat-icon gold">
      <FlaskConical size={20} />
    </span>
    <span className="farm-stat-label">{t('fertilizerStatus')}</span>
  </div>

  <div className="farm-stat-value">
    {fertilizerProgress}<small>%</small>
  </div>

  <div className="farm-progress">
    <span style={{ width: `${fertilizerProgress}%` }} />
  </div>

  <div className="farm-stat-foot">
    <span>{t('completedFertilizerShare')}</span>
    <span></span>
  </div>
</article>
              </section>

              <section className="farm-dashboard-grid">
  <article className="farm-panel farm-weather-panel">
    <div className="farm-panel-heading">
      <div>
        <span className="farm-panel-eyebrow">{t('todayStatus')}</span>
        <h3>{t('weather')}</h3>
      </div>
      <span className="farm-weather-icon">
        <ThermometerSun size={23} />
      </span>
    </div>

    <div className="farm-weather-content">
  {weatherLoading ? (
    <p>{t('loadingWeather')}</p>
  ) : weatherError ? (
    <p>{weatherError}</p>
  ) : weather ? (
    <>
      <div className="farm-weather-main">
        <div>
          <strong>
            {Math.round(weather.current.temperature_2m)}°C
          </strong>
          <p>
  {getWeatherDescription(weather.current.weather_code)}
</p>
<p className="farm-weather-location">
  {weather.placeName}, {weather.country}
</p>
        </div>
        <CloudSun size={46} />
      </div>

      <div className="farm-weather-details">
        <div>
          <Droplets size={19} />
          <span>{t('humidity')}</span>
          <strong>{weather.current.relative_humidity_2m}%</strong>
        </div>

        <div>
          <Wind size={19} />
          <span>{t('wind')}</span>
          <strong>{weather.current.wind_speed_10m} km/soat</strong>
        </div>

        <div>
          <ThermometerSun size={19} />
          <span>{t('feelsLike')}</span>
          <strong>{Math.round(weather.current.apparent_temperature)}°C</strong>
        </div>
      </div>
      <div className="farm-weather-forecast">
  <h4>{t('sevenDayForecast')}</h4>

  <div className="farm-forecast-list">
    {weather.daily.time.map((day, index) => (
      <div className="farm-forecast-item" key={day}>
        <span>
         {index === 0
  ? t('today')
  : new Date(`${day}T12:00:00`).toLocaleDateString(
  appLanguage === 'ru' ? 'ru-RU' :
  appLanguage === 'en' ? 'en-US' : 'uz-UZ',
  { weekday: 'short' }
)}
        </span>

        <strong>
          {Math.round(weather.daily.temperature_2m_max[index])}°
          {' / '}
          {Math.round(weather.daily.temperature_2m_min[index])}°
        </strong>

        <small>
          {getWeatherDescription(weather.daily.weather_code[index])}
        </small>
      </div>
    ))}
  </div>
</div>
    </>
  ) : (
    <p>{t('weatherUnavailable')}</p>
  )}
</div>

<button
  className="farm-outline-button"
  onClick={() => setProfile((old) => ({ ...old }))}
>
  {t('refreshData')} <ArrowUpRight size={16} />
</button>

    <button
      className="farm-outline-button"
      onClick={() => setWeatherRefresh((old) => old + 1)}
    >
      {t('statusAbout')} <ArrowUpRight size={16} />
    </button>
  </article>
</section>

              <section className="farm-bottom-grid">
                <article className="farm-panel farm-crops-panel">
                  <div className="farm-panel-heading">
                    <div><span className="farm-panel-eyebrow">{t('farm')}</span><h3>{t('activeCrops')}</h3></div>
                    <button className="farm-text-button" onClick={() => setActive('Ekinlar')}>{t('all')} <ChevronRight size={16} /></button>
                  </div>
                  <div className="farm-table-wrap">
                    <table className="farm-table">
                     <thead>
  <tr>
    <th>{t('cropType')}</th>
    <th>{t('area')}</th>
    <th>{t('plantedDate')}</th>
    <th>{t('growthStage')}</th>
  </tr>
</thead>
                      <tbody>
                        {crops.map((crop) => (
                         <tr key={crop.id}>
  <td>
    <span className={`farm-crop-symbol ${crop.color}`}>
      <Wheat size={18} />
    </span>
    <span className="farm-crop-name">
      {crop.name}
      <small>{crop.field}</small>
    </span>
  </td>
  <td>
  {crop.area} {t('hectare')}
</td>
  <td>
    {crop.plantedAt
  ? new Date(crop.plantedAt + 'T12:00:00').toLocaleDateString(
      appLanguage === 'ru' ? 'ru-RU' :
      appLanguage === 'en' ? 'en-US' : 'uz-UZ'
    )
  : t('notEntered')}
  </td>
 <td>
  <span className="farm-status-pill status-progress">
  {t('growing')}
</span>
</td>
</tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>

                <article className="farm-panel farm-tasks-panel">
                  <div className="farm-panel-heading">
                    <div><span className="farm-panel-eyebrow">{t('plan')}</span><h3>{t('todaysTasks')}</h3></div>
                    <CalendarDays size={20} className="farm-muted-icon" />
                  </div>
                  <div className="farm-task-list">
  {todayTasks.length > 0 ? (
    todayTasks.map((task) => (
      <label
        className={`farm-task ${task.done ? 'done' : ''}`}
        key={task.id}
      >
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => {
            if (task.type === 'irrigation') {
              updateIrrigationStatus(
                task.planId,
                task.done ? 'Rejalashtirilgan' : 'Bajarildi'
              )
            } else {
              updateFertilizerStatus(
                task.planId,
                task.done ? 'Rejalashtirilgan' : 'Bajarildi'
              )
            }
          }}
        />

        <span className="farm-task-title">
          {task.type === 'irrigation' ? t('irrigation') : task.title}
          <small>{task.time}</small>
        </span>

        {task.done && <CheckCircle2 size={17} />}
      </label>
    ))
  ) : (
    <p className="farm-empty-text">
      {t('noTasksToday')}
    </p>
  )}
</div>
                  <button className="farm-text-button farm-task-link" onClick={() => setActive('Kalendar')}>{t('openCalendar')} <ArrowUpRight size={16} /></button>
                </article>
              </section>
            </>
          ) : (
            <section className="farm-section-page">
              <div className="farm-date"><CalendarDays size={15} /> SMARTFARM PLANNER</div>
              
             
{active === 'Kalendar' && (
  <div className="farm-panel farm-section-panel farm-calendar">
    <div className="farm-panel-heading">
      <div>
        <span className="farm-panel-eyebrow">{t('calendarEyebrow')}</span>
<h3>{t('calendarTitle')}</h3>
      </div>

      <div className="farm-calendar-navigation">
        <button
          type="button"
          onClick={() =>
            setCalendarMonth(
              new Date(calendarYear, calendarMonthIndex - 1, 1)
            )
          }
          aria-label={t('previousMonth')}
        >
          <ChevronLeft size={19} />
        </button>

        <strong>{monthName}</strong>

        <button
          type="button"
          onClick={() =>
            setCalendarMonth(
              new Date(calendarYear, calendarMonthIndex + 1, 1)
            )
          }
          aria-label={t('nextMonth')}
        >
          <ChevronRight size={19} />
        </button>
      </div>
    </div>

    <div className="farm-calendar-grid">
      {[
  t('monday'),
  t('tuesday'),
  t('wednesday'),
  t('thursday'),
  t('friday'),
  t('saturday'),
  t('sunday'),
].map((day) => (
        <div className="farm-calendar-weekday" key={day}>
          {day}
        </div>
      ))}

      {calendarDays.map((day, index) => {
        if (day === null) {
          return <div className="farm-calendar-empty" key={`empty-${index}`} />
        }

        const dateKey = [
          calendarYear,
          String(calendarMonthIndex + 1).padStart(2, '0'),
          String(day).padStart(2, '0')
        ].join('-')

        const dayIrrigation = irrigationPlans.filter(
          (plan) => plan.irrigation_date === dateKey
        )

        const dayFertilizer = fertilizerPlans.filter(
          (plan) => plan.fertilizer_date === dateKey
        )

        const isSelected = selectedCalendarDate === dateKey
const today = new Date()
const todayKey = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, '0'),
  String(today.getDate()).padStart(2, '0')
].join('-')

const isToday = todayKey === dateKey
        return (
          <button
            type="button"
            key={dateKey}
           className={`farm-calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
            onClick={() => setSelectedCalendarDate(dateKey)}
          >
            <span>{day}</span>

            {dayIrrigation.length > 0 && (
              <small className="calendar-irrigation-dot">
                <Droplets size={13} /> {dayIrrigation.length}
              </small>
            )}

            {dayFertilizer.length > 0 && (
              <small className="calendar-fertilizer-dot">
                <Sprout size={13} /> {dayFertilizer.length}
              </small>
            )}
          </button>
        )
      })}
    </div>

    <div className="farm-calendar-selected">
  <h4>{selectedCalendarDate} — {t('calendarTasks')}</h4>

  {[
    ...irrigationPlans
      .filter((plan) => plan.irrigation_date === selectedCalendarDate)
      .map((plan) => ({
        id: `i-${plan.id}`,
        planId: plan.id,
        type: 'irrigation',
        title: 'Sug‘orish',
        icon: <Droplets size={17} />,
        time: plan.irrigation_time,
        status: plan.status
      })),

    ...fertilizerPlans
      .filter((plan) => plan.fertilizer_date === selectedCalendarDate)
      .map((plan) => ({
        id: `f-${plan.id}`,
        planId: plan.id,
        type: 'fertilizer',
        title: plan.fertilizer_name,
        icon: <Sprout size={17} />,
        time: plan.fertilizer_time,
        status: plan.status
      }))
  ].length === 0 ? (
    <p>{t('noCalendarTasks')}</p>
  ) : (
    [
      ...irrigationPlans
        .filter((plan) => plan.irrigation_date === selectedCalendarDate)
        .map((plan) => ({
          id: `i-${plan.id}`,
          planId: plan.id,
          type: 'irrigation',
          title: 'Sug‘orish',
          icon: <Droplets size={17} />,
          time: plan.irrigation_time,
          status: plan.status
        })),

      ...fertilizerPlans
        .filter((plan) => plan.fertilizer_date === selectedCalendarDate)
        .map((plan) => ({
          id: `f-${plan.id}`,
          planId: plan.id,
          type: 'fertilizer',
          title: plan.fertilizer_name,
          icon: <Sprout size={17} />,
          time: plan.fertilizer_time,
          status: plan.status
        }))
    ].map((task) => (
      <div className="farm-calendar-event" key={task.id}>
        <strong className="farm-calendar-event-title">
          {task.icon}
          {task.type === 'irrigation' ? t('irrigation') : task.title}
        </strong>

        <span>{String(task.time || '').slice(0, 5)}</span>

        <span>
  {task.status === 'Rejalashtirilgan'
    ? t('planned')
    : task.status === 'Jarayonda'
      ? t('inProgress')
      : task.status === 'Bajarildi'
        ? t('completed')
        : task.status}
</span>

        <div className="farm-action-buttons">
          <button
            type="button"
            className="farm-icon-button farm-edit-button"
            title="Tahrirlash"
           onClick={() => {
  if (task.type === 'irrigation') {
    const plan = irrigationPlans.find(
      (p) => p.id === task.planId
    )
    setActive('Sug‘orish')
    startEditIrrigation(plan)
  } else {
    const plan = fertilizerPlans.find(
      (p) => p.id === task.planId
    )
    setActive('O‘g‘itlash')
    startEditFertilizer(plan)
  }
}}
          >
            <Pencil size={17} />
          </button>

          <button
            type="button"
            className="farm-icon-button farm-delete-button"
            title="O‘chirish"
            onClick={() =>
              task.type === 'irrigation'
                ? deleteIrrigationPlan(task.planId)
                : deleteFertilizerPlan(task.planId)
            }
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    ))
  )}
</div>
  </div>
)}
{active === 'Bildirishnomalar' && (
  <div className="farm-panel farm-section-panel">
    <div className="farm-notification-stats">
  <div className="farm-notification-stat">
    <span>{t('totalNotifications')}</span>
    <strong>{notifications.length}</strong>
  </div>

  <div className="farm-notification-stat">
    <span>{t('unread')}</span>
    <strong>
      {notifications.filter((item) => !item.is_read).length}
    </strong>
  </div>

  <div className="farm-notification-stat">
    <span>{t('read')}</span>
    <strong>
      {notifications.filter((item) => item.is_read).length}
    </strong>
  </div>
</div>
   <div className="farm-notifications-header">
  <div>
    <h2>{t('notifications')}</h2>
    <p>{t('notificationsDescription')}</p>
  </div>

  <div className="farm-notifications-tools">
    <span className="farm-notification-count">
      {notifications.filter((item) => !item.is_read).length} {t('new')}
    </span>

    {notifications.some((item) => !item.is_read) && (
  <button
    type="button"
    className="farm-icon-button farm-edit-button"
    title={t('markAllRead')}
aria-label={t('markAllRead')}
    onClick={markAllNotificationsAsRead}
  >
    <CheckCheck size={18} />
  </button>
)}

<button
  type="button"
  className="farm-icon-button farm-delete-button"
  title={t('deleteAll')}
aria-label={t('deleteAll')}
  onClick={deleteAllNotifications}
  disabled={notifications.length === 0}
>
  <Trash2 size={18} />
</button>
  </div>
</div>

    {loadingNotifications ? (
      <p>{t('notificationsLoading')}</p>
    ) : notifications.length === 0 ? (
      <div className="farm-empty-state">
        <Bell size={32} />
        <h3>{t('noNotifications')}</h3>
<p>{t('newMessagesHere')}</p>
      </div>
    ) : (
      <div className="farm-notifications-list">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`farm-notification-item ${
              item.is_read ? 'is-read' : 'is-unread'
            }`}
            onClick={() => markNotificationAsRead(item.id)}
          >
            <div className="farm-notification-icon">
              <Bell size={19} />
            </div>

            <div className="farm-notification-content">
              <strong>{item.title}</strong>
              <p>{item.message}</p>
              <span>
                {new Date(item.created_at).toLocaleString(
  appLanguage === 'uz' ? 'uz-UZ' :
  appLanguage === 'ru' ? 'ru-RU' : 'en-US'
)}
              </span>
            </div>
            <div className="farm-notification-actions">
  {!item.is_read && (
    <button
      type="button"
      className="farm-icon-button farm-edit-button"
      title={t('markAsRead')}
aria-label={t('markAsRead')}
      onClick={(e) => {
        e.stopPropagation()
        markNotificationAsRead(item.id)
      }}
    >
      <Check size={17} />
    </button>
  )}

  <button
    type="button"
    className="farm-icon-button farm-delete-button"
    title={t('deleteNotification')}
aria-label={t('deleteNotification')}
    onClick={(e) => {
      e.stopPropagation()
      deleteNotification(item.id)
    }}
  >
    <Trash2 size={17} />
  </button>
</div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
              {active === 'Ekinlar' && (
                <div className="farm-panel farm-section-panel">
                  <div className="farm-panel-heading">
                    <div>
  <span className="farm-panel-eyebrow">{t('cropSectionEyebrow')}</span>
  <h3>{t('cropListTitle')}</h3>
</div>
<button
  className="farm-primary-button"
  onClick={() => {
    setShowCropForm((prev) => !prev)
    setCropNotice('')
  }}
>
  {showCropForm ? t('cropCancel') : `+ ${t('addCropButton')}`}
</button>
                  </div>
                 
{showCropForm && (
  <form className="farm-crop-form" onSubmit={addCrop}>
    <label>
      {t('cropNameLabel')}
      <input
        value={cropName}
        onChange={(e) => setCropName(e.target.value)}
       placeholder={t('cropPlaceholder')}
        required
      />
    </label>

    <label>
      {t('cropAreaLabel')}
      <input
        type="number"
        min="0.1"
        step="0.1"
        value={cropArea}
        onChange={(e) => setCropArea(e.target.value)}
        placeholder="Masalan, 5"
        required
      />
    </label>

    <label>
      {t('cropPlantedDate')}
      <input
        type="date"
        value={plantedAt}
        onChange={(e) => setPlantedAt(e.target.value)}
        required
      />
    </label>

    <label>
      {t('cropStageLabel')}
      <select
        value={cropStage}
        onChange={(e) => setCropStage(e.target.value)}
        required
      >
        <option value="Ekishga tayyorlanmoqda">{t('stagePreparing')}</option>
<option value="Ekildi">{t('stagePlanted')}</option>
<option value="Unib chiqdi">{t('stageSprouted')}</option>
<option value="O‘sish jarayonida">{t('stageGrowing')}</option>
<option value="Gullash bosqichi">{t('stageFlowering')}</option>
<option value="Hosil shakllanmoqda">{t('stageForming')}</option>
<option value="Hosilga tayyor">{t('stageReady')}</option>
<option value="Hosil yig‘ildi">{t('stageHarvested')}</option>
      </select>
    </label>

    <button
      className="farm-primary-button"
      type="submit"
      disabled={savingCrop}
    >
      {savingCrop ? t('cropSaving') : t('cropSave')}
    </button>
  </form>
)}

{editingCrop && (
  <form className="farm-crop-form" onSubmit={saveEditedCrop}>
    <h3 style={{ gridColumn: '1 / -1' }}>{t('cropEditTitle')}</h3>

    <label>
      {t('cropNameLabel')}
      <input
        value={editCropName}
        onChange={(e) => setEditCropName(e.target.value)}
        required
      />
    </label>

    <label>
      {t('cropAreaLabel')}
      <input
        type="number"
        min="0.1"
        step="0.1"
        value={editCropArea}
        onChange={(e) => setEditCropArea(e.target.value)}
        required
      />
    </label>

    <label>
      {t('cropPlantedDate')}
      <input
        type="date"
        value={editPlantedAt}
        onChange={(e) => setEditPlantedAt(e.target.value)}
        required
      />
    </label>

    <label>
      {t('cropStageLabel')}
      <select
        value={editCropStage}
        onChange={(e) => setEditCropStage(e.target.value)}
        required
      >
       <option value="Ekishga tayyorlanmoqda">{t('stagePreparing')}</option>
<option value="Ekildi">{t('stagePlanted')}</option>
<option value="Unib chiqdi">{t('stageSprouted')}</option>
<option value="O‘sish jarayonida">{t('stageGrowing')}</option>
<option value="Gullash bosqichi">{t('stageFlowering')}</option>
<option value="Hosil shakllanmoqda">{t('stageForming')}</option>
<option value="Hosilga tayyor">{t('stageReady')}</option>
<option value="Hosil yig‘ildi">{t('stageHarvested')}</option>
      </select>
    </label>

    <button
      type="submit"
      className="farm-primary-button"
      disabled={savingEdit}
    >
      {savingEdit ? t('cropSaving') : t('cropSaveChanges')}
    </button>

    <button
      type="button"
      className="farm-outline-button"
      onClick={() => setEditingCrop(null)}
    >
      {t('cropCancel')}
    </button>
  </form>
)}


                  <div className="farm-table-wrap">
                    <table className="farm-table">
                      <thead>
  <tr>
    <th>{t('cropTableType')}</th>
    <th>{t('cropTableArea')}</th>
    <th>{t('cropTableStatus')}</th>
    <th>{t('cropTableActions')}</th>
  </tr>
</thead>
                      
                     
<tbody>
  {crops.map((crop) => (
    <tr key={crop.id}>
      <td>
        {crop.name}
        <small className="farm-table-sub">
  {crop.field === 'Yangi maydon'
    ? t('newField')
    : crop.field}
</small>
      </td>

      <td>
  {crop.area} {t('hectare')}
</td>

      <td>
  <span className={`farm-status-pill ${
    crop.status === 'Hosilga tayyor'
      ? 'status-ready'
      : crop.status === 'Hosil yig‘ildi'
        ? 'status-completed'
        : crop.status === 'O‘sish jarayonida'
          ? 'status-progress'
          : 'status-planned'
  }`}>
    {{
      'Ekishga tayyorlanmoqda': t('stagePreparing'),
      'Ekildi': t('stagePlanted'),
      'Unib chiqdi': t('stageSprouted'),
      'O‘sish jarayonida': t('stageGrowing'),
      'Gullash bosqichi': t('stageFlowering'),
      'Hosil shakllanmoqda': t('stageForming'),
      'Hosilga tayyor': t('stageReady'),
      'Hosil yig‘ildi': t('stageHarvested'),
    }[crop.status] || crop.status}
  </span>
</td>

      
<td>
  <div className="farm-action-buttons">
    <button
      type="button"
      className="farm-icon-button farm-edit-button"
      onClick={() => startEditCrop(crop)}
      title={t('cropEdit')}
      aria-label={t('cropEdit')}
    >
      <Pencil size={17} strokeWidth={1.8} />
    </button>

    <button
      type="button"
      className="farm-icon-button farm-delete-button"
      onClick={() => deleteCrop(crop.id)}
      title={t('cropDelete')}
      aria-label={t('cropDelete')}
    >
      <Trash2 size={17} strokeWidth={1.8} />
    </button>
  </div>
</td>

    </tr>
  ))}
</tbody>

                    </table>
                  </div>
                </div>
              )}

             
{active === 'Maydonlar' && (
  <div className="farm-panel farm-section-panel">
    <div className="farm-panel-heading">
      <div>
        <h2>{t('myFields')}</h2>
        <p>{t('manageFields')}</p>
      </div>

      <button
        type="button"
        className="farm-primary-button"
        onClick={() => {
          setShowFieldForm(!showFieldForm)
          setFieldNotice('')
        }}
      >
        {showFieldForm ? t('cropCancel') : `+ ${t('addField')}`}
      </button>
    </div>

    {fieldNotice && <p role="status">{fieldNotice}</p>}

    {showFieldForm && (
      <form
        className="farm-crop-form"
        onSubmit={editingFieldId !== null ? saveEditedField : addField}
      >
        <label>
          {t('fieldName')}
          <input
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            placeholder={t('fieldPlaceholder')}
            required
          />
        </label>

        <label>
          {t('fieldSize')}
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={fieldArea}
            onChange={(e) => setFieldArea(e.target.value)}
            placeholder="5"
            required
          />
        </label>

        <label>
          {t('soilType')}
          <select
            value={fieldSoil}
            onChange={(e) => setFieldSoil(e.target.value)}
            required
          >
            <option value="Qora tuproq">{t('blackSoil')}</option>
            <option value="Bo‘z tuproq">{t('graySoil')}</option>
            <option value="Qumloq tuproq">{t('sandySoil')}</option>
            <option value="Sho‘rlangan tuproq">{t('salineSoil')}</option>
            <option value="Boshqa">{t('otherSoil')}</option>
          </select>
        </label>

        <button
          type="submit"
          className="farm-primary-button"
          disabled={savingField}
        >
          {savingField ? t('cropSaving') : t('saveField')}
        </button>
      </form>
    )}

    <div className="farm-table-wrap">
      <table className="farm-table">
        <thead>
          <tr>
            <th>{t('fieldNameColumn')}</th>
            <th>{t('fieldSizeColumn')}</th>
            <th>{t('soilColumn')}</th>
            <th>{t('cropTableActions')}</th>
          </tr>
        </thead>

        <tbody>
          {fields.map((field) => (
            <tr key={field.id}>
              <td>{field.name}</td>

              <td>
                {field.area_ha} {t('hectare')}
              </td>

              <td>
                {{
                  'Qora tuproq': t('blackSoil'),
                  'Bo‘z tuproq': t('graySoil'),
                  'Qumloq tuproq': t('sandySoil'),
                  'Sho‘rlangan tuproq': t('salineSoil'),
                  'Boshqa': t('otherSoil'),
                }[field.soil] || field.soil}
              </td>

              <td>
                <div className="farm-action-buttons">
                  <button
                    type="button"
                    className="farm-icon-button farm-edit-button"
                    onClick={() => startEditField(field)}
                    title={t('cropEdit')}
                    aria-label={t('cropEdit')}
                  >
                    <Pencil size={17} strokeWidth={1.8} />
                  </button>

                  <button
                    type="button"
                    className="farm-icon-button farm-delete-button"
                    onClick={() => deleteField(field.id)}
                    title={t('cropDelete')}
                    aria-label={t('cropDelete')}
                  >
                    <Trash2 size={17} strokeWidth={1.8} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {fields.length === 0 && (
            <tr>
              <td colSpan={4}>
                {t('noFields')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

{active === 'Sug‘orish' && (
  <div className="farm-panel farm-section-panel">
    <div className="farm-panel-heading">
      <div>
        <h2>{t('irrigationPlansTitle')}</h2>
        <p>{t('manageIrrigation')}</p>
      </div>

      <button
        type="button"
        className="farm-primary-button"
        onClick={() => {
          setShowIrrigationForm((prev) => !prev)
          setIrrigationNotice('')
        }}
      >
        {showIrrigationForm
          ? t('cropCancel')
          : `+ ${t('addPlan')}`}
      </button>
    </div>

    {irrigationNotice && (
      <p role="status">{irrigationNotice}</p>
    )}

    {showIrrigationForm && (
      <form
        className="farm-crop-form"
        onSubmit={
          editingIrrigationId !== null
            ? saveEditedIrrigation
            : addIrrigationPlan
        }
      >
        <label>
          {t('selectField')}
          <select
            value={irrigationFieldId}
            onChange={(e) => setIrrigationFieldId(e.target.value)}
            required
          >
            <option value="">{t('chooseField')}</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name} — {field.area_ha} {t('hectare')}
              </option>
            ))}
          </select>
        </label>

        <label>
          {t('irrigationDate')}
          <input
            type="date"
            value={irrigationDate}
            onChange={(e) => setIrrigationDate(e.target.value)}
            required
          />
        </label>

        <label>
          {t('irrigationTime')}
          <input
            type="time"
            value={irrigationTime}
            onChange={(e) => setIrrigationTime(e.target.value)}
            required
          />
        </label>

        <label>
          {t('waterAmount')}
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={waterAmount}
            onChange={(e) => setWaterAmount(e.target.value)}
            placeholder={t('waterPlaceholder')}
            required
          />
        </label>

        <label>
          {t('optionalNote')}
          <input
            type="text"
            value={irrigationNotes}
            onChange={(e) => setIrrigationNotes(e.target.value)}
            placeholder={t('irrigationNotePlaceholder')}
          />
        </label>

        <button
          type="submit"
          className="farm-primary-button"
          disabled={savingIrrigation || fields.length === 0}
        >
          {savingIrrigation
            ? t('cropSaving')
            : editingIrrigationId !== null
              ? t('saveChanges')
              : t('savePlan')}
        </button>

        {fields.length === 0 && (
          <p>{t('addFieldFirst')}</p>
        )}
      </form>
    )}

    <div className="farm-table-wrap">
      <table className="farm-table">
        <thead>
          <tr>
            <th>{t('fieldColumn')}</th>
            <th>{t('dateColumn')}</th>
            <th>{t('timeColumn')}</th>
            <th>{t('waterColumn')}</th>
            <th>{t('statusColumn')}</th>
            <th>{t('noteColumn')}</th>
            <th>{t('actionsColumn')}</th>
          </tr>
        </thead>

        <tbody>
          {irrigationPlans.map((plan) => {
            const field = fields.find(
              (item) => item.id === plan.field_id
            )

            const translatedStatus = {
              Rejalashtirilgan: t('irrigationStatusPlanned'),
              Jarayonda: t('irrigationStatusProgress'),
              Bajarildi: t('irrigationStatusCompleted'),
            }[plan.status] || plan.status

            return (
              <tr key={plan.id}>
                <td>
                  {field ? field.name : t('fieldNotFound')}
                </td>

                <td>{plan.irrigation_date}</td>

                <td>
                  {String(plan.irrigation_time).slice(0, 5)}
                </td>

                <td>{plan.water_amount}</td>

                <td>
                  <div className="farm-irrigation-status">
                    <span
                      className={`farm-status-pill ${
                        plan.status === 'Bajarildi'
                          ? 'status-completed'
                          : plan.status === 'Jarayonda'
                            ? 'status-progress'
                            : 'status-planned'
                      }`}
                    >
                      {translatedStatus}
                    </span>

                    {plan.status === 'Jarayonda' && (
                      <button
                        type="button"
                        className="farm-complete-button"
                        onClick={() =>
                          updateIrrigationStatus(
                            plan.id,
                            'Bajarildi'
                          )
                        }
                      >
                        <Check size={16} />
                        {t('completeIrrigation')}
                      </button>
                    )}
                  </div>
                </td>

                <td>{plan.notes || '—'}</td>

                <td>
                  <div className="farm-action-buttons">
                    <button
                      type="button"
                      className="farm-icon-button farm-edit-button"
                      onClick={() => startEditIrrigation(plan)}
                      title={t('cropEdit')}
                      aria-label={t('cropEdit')}
                    >
                      <Pencil size={17} strokeWidth={1.8} />
                    </button>

                    <button
                      type="button"
                      className="farm-icon-button farm-delete-button"
                      onClick={() => deleteIrrigationPlan(plan.id)}
                      title={t('cropDelete')}
                      aria-label={t('cropDelete')}
                    >
                      <Trash2 size={17} strokeWidth={1.8} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}

          {irrigationPlans.length === 0 && (
            <tr>
              <td colSpan={7}>
                {t('noIrrigationPlans')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

{active === 'O‘g‘itlash' && (
  <div className="farm-panel farm-section-panel">
    <div className="farm-panel-heading">
      <div>
        <h2>{t('fertilizerPlansTitle')}</h2>
        <p>{t('manageFertilizer')}</p>
      </div>

      <button
        type="button"
        className="farm-primary-button"
        onClick={() => {
          if (showFertilizerForm) {
            setShowFertilizerForm(false)
            setEditingFertilizerId(null)
            setFertilizerFieldId('')
            setFertilizerName('')
            setFertilizerAmount('')
            setFertilizerDate('')
            setFertilizerNotes('')
          } else {
            setEditingFertilizerId(null)
            setShowFertilizerForm(true)
          }

          setFertilizerNotice('')
        }}
      >
        {showFertilizerForm ? t('cropCancel') : `+ ${t('addPlan')}`}
      </button>
    </div>

    {fertilizerNotice && (
      <p role="status">{fertilizerNotice}</p>
    )}

    {showFertilizerForm && (
      <form
        className="farm-crop-form"
        onSubmit={
          editingFertilizerId !== null
            ? saveEditedFertilizer
            : addFertilizerPlan
        }
      >
        <label>
          {t('selectField')}
          <select
            value={fertilizerFieldId}
            onChange={(e) => setFertilizerFieldId(e.target.value)}
            required
          >
            <option value="">{t('chooseField')}</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name} — {field.area_ha} {t('hectare')}
              </option>
            ))}
          </select>
        </label>

        <label>
          {t('fertilizerType')}
          <select
            value={fertilizerName}
            onChange={(e) => setFertilizerName(e.target.value)}
            required
          >
            <option value="">{t('chooseFertilizer')}</option>
            <option value="Azotli o‘g‘it">{t('nitrogenFertilizer')}</option>
            <option value="Fosforli o‘g‘it">{t('phosphorusFertilizer')}</option>
            <option value="Kaliyli o‘g‘it">{t('potassiumFertilizer')}</option>
            <option value="Organik o‘g‘it">{t('organicFertilizer')}</option>
            <option value="Kompleks o‘g‘it">{t('complexFertilizer')}</option>
            <option value="Boshqa">{t('otherSoil')}</option>
          </select>
        </label>

        <label>
          {t('fertilizerAmount')}
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={fertilizerAmount}
            onChange={(e) => setFertilizerAmount(e.target.value)}
            placeholder={t('fertilizerAmountPlaceholder')}
            required
          />
        </label>

        <label>
          {t('fertilizerDate')}
          <input
            type="date"
            value={fertilizerDate}
            onChange={(e) => setFertilizerDate(e.target.value)}
            required
          />
        </label>

        <label>
          {t('fertilizerTime')}
          <input
            type="time"
            value={fertilizerTime}
            onChange={(e) => setFertilizerTime(e.target.value)}
            required
          />
        </label>

        <label>
          {t('optionalNote')}
          <input
            type="text"
            value={fertilizerNotes}
            onChange={(e) => setFertilizerNotes(e.target.value)}
            placeholder={t('fertilizerNotePlaceholder')}
          />
        </label>

        <button
          type="submit"
          className="farm-primary-button"
          disabled={savingFertilizer || fields.length === 0}
        >
          {savingFertilizer
            ? t('cropSaving')
            : editingFertilizerId !== null
              ? t('saveChanges')
              : t('savePlan')}
        </button>

        {fields.length === 0 && (
          <p>{t('addFieldFirst')}</p>
        )}
      </form>
    )}

    <div className="farm-table-wrap">
      <table className="farm-table">
        <thead>
          <tr>
            <th>{t('fieldColumn')}</th>
            <th>{t('fertilizerColumn')}</th>
            <th>{t('amountColumn')}</th>
            <th>{t('dateColumn')}</th>
            <th>{t('timeColumn')}</th>
            <th>{t('statusColumn')}</th>
            <th>{t('noteColumn')}</th>
            <th>{t('actionsColumn')}</th>
          </tr>
        </thead>

        <tbody>
          {fertilizerPlans.map((plan) => {
            const field = fields.find(
              (item) => item.id === plan.field_id
            )

            const fertilizerLabels = {
              'Azotli o‘g‘it': t('nitrogenFertilizer'),
              'Fosforli o‘g‘it': t('phosphorusFertilizer'),
              'Kaliyli o‘g‘it': t('potassiumFertilizer'),
              'Organik o‘g‘it': t('organicFertilizer'),
              'Kompleks o‘g‘it': t('complexFertilizer'),
              'Boshqa': t('otherSoil'),
            }

            const statusLabels = {
              Rejalashtirilgan: t('irrigationStatusPlanned'),
              Jarayonda: t('irrigationStatusProgress'),
              Bajarildi: t('irrigationStatusCompleted'),
            }

            return (
              <tr key={plan.id}>
                <td>{field ? field.name : t('fieldNotFound')}</td>
                <td>
                  {fertilizerLabels[plan.fertilizer_name] || plan.fertilizer_name}
                </td>
                <td>{plan.fertilizer_amount}</td>
                <td>{plan.fertilizer_date}</td>
                <td>
                  {plan.fertilizer_time
                    ? String(plan.fertilizer_time).slice(0, 5)
                    : '—'}
                </td>
                <td>
                  <div className="farm-irrigation-status">
                    <span
                      className={`farm-status-pill ${
                        plan.status === 'Bajarildi'
                          ? 'status-completed'
                          : plan.status === 'Jarayonda'
                            ? 'status-progress'
                            : 'status-planned'
                      }`}
                    >
                      {statusLabels[plan.status] || plan.status}
                    </span>

                    {plan.status === 'Jarayonda' && (
                      <button
                        type="button"
                        className="farm-complete-button"
                        onClick={() =>
                          updateFertilizerStatus(plan.id, 'Bajarildi')
                        }
                      >
                        <Check size={16} />
                        {t('completeIrrigation')}
                      </button>
                    )}
                  </div>
                </td>
                <td>{plan.notes || '—'}</td>
                <td>
                  <div className="farm-action-buttons">
                    <button
                      type="button"
                      className="farm-icon-button farm-edit-button"
                      onClick={() => startEditFertilizer(plan)}
                      title={t('cropEdit')}
                      aria-label={t('cropEdit')}
                    >
                      <Pencil size={17} strokeWidth={1.8} />
                    </button>

                    <button
                      type="button"
                      className="farm-icon-button farm-delete-button"
                      onClick={() => deleteFertilizerPlan(plan.id)}
                      title={t('cropDelete')}
                      aria-label={t('cropDelete')}
                    >
                      <Trash2 size={17} strokeWidth={1.8} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}

          {fertilizerPlans.length === 0 && (
            <tr>
              <td colSpan={8}>
                {t('noFertilizerPlans')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

{active !== 'Ekinlar' &&
  active !== 'Maydonlar' &&
  active !== 'Sug‘orish' &&
  active !== 'O‘g‘itlash' &&
  active !== 'Kalendar' &&
  active !== 'Bildirishnomalar' && (
  <div className="farm-panel farm-empty-panel">
   {active !== 'Profil' && active !== 'Sozlamalar' && (
  <span className="farm-empty-icon">
    {active === 'Sug‘orish' ? <Droplets size={27} /> :
     active === 'O‘g‘itlash' ? <FlaskConical size={27} /> :
     active === 'Kalendar' ? <CalendarDays size={27} /> :
     active === 'Bildirishnomalar' ? <Bell size={27} /> :
     <UserRound size={27} />}
  </span>
)}
    {active === 'Profil' && (
  <div className="farm-panel farm-profile-panel">
    <div className="farm-profile-heading">
  <div className="farm-profile-title">
    <UserRound size={25} />
    <h2>{t('personalProfile')}</h2>
  </div>

  <p>{t('profileDescription')}</p>
</div>

    {loadingProfile ? (
      <p>{t('profileLoading')}</p>
    ) : (
      <>
        {!isEditingProfile ? (
          <div className="farm-profile-view">
          <label className="farm-profile-avatar-wrapper">
  <div className="farm-profile-avatar">
    {profile.avatar_url ? (
      <img src={profile.avatar_url} alt={t('profilePhoto')} />
    ) : (
      <UserRound size={42} />
    )}
  </div>

  <span>{t('changePhoto')}</span>

  <input
    type="file"
    accept="image/*"
    onChange={uploadProfileAvatar}
    hidden
  />
</label>

            <div className="farm-profile-info">
              <p><strong>{t('fullName')}:</strong> {profile.full_name || t('notProvided')}</p>
<p><strong>{t('email')}:</strong> {user?.email || '—'}</p>
<p><strong>{t('phone')}:</strong> {profile.phone || t('notProvided')}</p>
<p><strong>{t('farmName')}:</strong> {profile.farm_name || t('notProvided')}</p>
<p><strong>{t('location')}:</strong> {profile.farm_location || t('notProvided')}</p>
            </div>

            <button
              type="button"
              className="farm-primary-button"
              onClick={() => {
                setProfileNotice('')
                setIsEditingProfile(true)
              }}
            >
              {t('editInformation')}
            </button>
          </div>
        ) : (
          <form onSubmit={saveProfile} className="farm-profile-form">
           <label className="farm-profile-avatar-wrapper">
  <div className="farm-profile-avatar">
    {profile.avatar_url ? (
      <img src={profile.avatar_url} alt={t('profilePhoto')} />
    ) : (
      <UserRound size={42} />
    )}
  </div>

  <span>{t('changePhoto')}</span>

  <input
    type="file"
    accept="image/*"
    onChange={uploadProfileAvatar}
    hidden
  />
</label>

            <label>
              {t('fullName')}
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                placeholder={t('enterFullName')}
                required
              />
            </label>

            <label>
              {t('email')}
              <input type="email" value={user?.email || ''} disabled />
            </label>

            <label>
              {t('phone')}
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={profile.phone}
                onChange={(e) => {
                  let digits = e.target.value.replace(/\D/g, '')

                  if (digits.startsWith('998')) {
                    digits = digits.slice(3)
                  }

                  digits = digits.slice(0, 9)

                  let formatted = '+998'

                  if (digits.length > 0) formatted += ' ' + digits.slice(0, 2)
                  if (digits.length > 2) formatted += ' ' + digits.slice(2, 5)
                  if (digits.length > 5) formatted += ' ' + digits.slice(5, 7)
                  if (digits.length > 7) formatted += ' ' + digits.slice(7, 9)

                  setProfile({ ...profile, phone: formatted })
                }}
                placeholder="+998 XX XXX XX XX"
              />
            </label>

            <label>
              {t('farmName')}
              <input
                type="text"
                value={profile.farm_name}
                onChange={(e) =>
                  setProfile({ ...profile, farm_name: e.target.value })
                }
                placeholder={t('enterFarmName')}
              />
            </label>

            <label>
              {t('location')}
              <input
                type="text"
                value={profile.farm_location}
                onChange={(e) =>
                  setProfile({ ...profile, farm_location: e.target.value })
                }
                placeholder={t('enterLocation')}
              />
            </label>

            {profileNotice && (
              <p className="farm-profile-notice">{profileNotice}</p>
            )}

            <div className="farm-profile-actions">
              <button
                type="submit"
                className="farm-primary-button"
                disabled={savingProfile}
              >
                {savingProfile ? t('saving') : t('saveChanges')}
              </button>

              <button
                type="button"
                className="farm-outline-button"
                onClick={() => {
                  setIsEditingProfile(false)
                  setProfileNotice('')
                }}
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        )}
      </>
    )}

    <div className="farm-profile-logout">
      <button className="farm-outline-button" onClick={logout}>
  {t('logout')} <LogOut size={16} />
</button>
    </div>
  </div>
)}
{active === 'Sozlamalar' && (
  <div className="farm-panel farm-settings-panel">
    <div className="farm-profile-heading">
      <div className="farm-profile-title">
        <Settings size={25} />
        <h2>{t('settings')}</h2>
      </div>
      <p>{t('settingsDescription')}</p>
    </div>
<div className="farm-settings-grid">
  <div className="farm-password-section">
      <h3>{t('passwordSecurity')}</h3>
      <p>{t('passwordDescription')}</p>

      {!showPasswordForm ? (
        <button
          type="button"
          className="farm-outline-button"
          onClick={() => {
            setPasswordNotice('')
            setShowPasswordForm(true)
          }}
        >
          {t('changePassword')}
        </button>
      ) : (
        <form className="farm-password-form" onSubmit={changePassword}>
          <label>
            Yangi parol
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Yangi parolni kiriting"
              minLength={8}
              required
            />
          </label>

          <label>
            Yangi parolni tasdiqlang
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Parolni qayta kiriting"
              minLength={8}
              required
            />
          </label>

          {passwordNotice && (
            <p className="farm-profile-notice">{passwordNotice}</p>
          )}

          <div className="farm-profile-actions">
            <button
              type="submit"
              className="farm-primary-button"
              disabled={savingPassword}
            >
              {savingPassword ? 'Saqlanmoqda...' : 'Yangi parolni saqlash'}
            </button>

            <button
              type="button"
              className="farm-outline-button"
              onClick={() => {
                setShowPasswordForm(false)
                setNewPassword('')
                setConfirmPassword('')
                setPasswordNotice('')
              }}
            >
              Bekor qilish
            </button>
          </div>
        </form>
      )}
    </div>
    <div className="farm-notification-settings">
  <h3>{t('notificationSettings')}</h3>
  <p>{t('notificationDescription')}</p>

  <div className="farm-notification-option">
    <label htmlFor="irrigation-notifications">
      {t('irrigationReminders')}
    </label>
    <input
      id="irrigation-notifications"
      type="checkbox"
      checked={irrigationNotificationsEnabled}
      onChange={(e) => {
        const enabled = e.target.checked
        setIrrigationNotificationsEnabled(enabled)
        localStorage.setItem('irrigationNotificationsEnabled', String(enabled))
      }}
    />
  </div>

  <div className="farm-notification-option">
    <label htmlFor="fertilizer-notifications">
     {t('fertilizerReminders')}
    </label>
    <input
      id="fertilizer-notifications"
      type="checkbox"
      checked={fertilizerNotificationsEnabled}
      onChange={(e) => {
        const enabled = e.target.checked
        setFertilizerNotificationsEnabled(enabled)
        localStorage.setItem('fertilizerNotificationsEnabled', String(enabled))
      }}
    />
  </div>
</div>
<div className="farm-password-section farm-language-settings">
  <h3>{t('languageSettings')}</h3>
  <p>{t('languageDescription')}</p>

 <select
  value={appLanguage}
  onChange={(e) => {
    const language = e.target.value
    setAppLanguage(language)
    localStorage.setItem('appLanguage', language)
  }}
>
    <option value="uz">{t('uzbek')}</option>
<option value="ru">{t('russian')}</option>
<option value="en">{t('english')}</option>
  </select>
</div>
<div className="farm-password-section farm-theme-settings">
  <h3>{t('themeSettings')}</h3>
  <p>{t('themeDescription')}</p>

  <label>
    <input
      type="checkbox"
      checked={darkTheme}
      onChange={(e) => {
        const enabled = e.target.checked
        setDarkTheme(enabled)
        localStorage.setItem('darkTheme', String(enabled))
      }}
    />
    {t('darkMode')}
  </label>
</div>
</div>
</div>
)}
  </div>
)}

            </section>
          )}
        </div>
      </main>
    </div>
  )
}
