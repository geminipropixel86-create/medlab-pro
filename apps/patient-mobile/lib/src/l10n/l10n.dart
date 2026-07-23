import 'package:flutter/material.dart';

class L10n {
  static const all = [Locale('en'), Locale('es'), Locale('fr'), Locale('ar')];

  static const Map<String, Map<String, String>> strings = {
    'en': {
      'app_name': 'MedLab Pro',
      'login': 'Login',
      'email': 'Email',
      'password': 'Password',
      'forgot_password': 'Forgot Password?',
      'no_account': "Don't have an account?",
      'register': 'Register',
      'home': 'Home',
      'tests': 'My Tests',
      'results': 'Results',
      'profile': 'Profile',
      'settings': 'Settings',
      'logout': 'Logout',
      'test_status': 'Test Status',
      'view_report': 'View Report',
      'no_tests': 'No tests found',
      'loading': 'Loading...',
      'error': 'An error occurred',
      'retry': 'Retry',
    },
    'es': {
      'app_name': 'MedLab Pro',
      'login': 'Iniciar Sesión',
      'email': 'Correo electrónico',
      'password': 'Contraseña',
      'home': 'Inicio',
      'tests': 'Mis Pruebas',
      'results': 'Resultados',
      'profile': 'Perfil',
      'logout': 'Cerrar Sesión',
      'no_tests': 'No se encontraron pruebas',
    },
    'fr': {
      'app_name': 'MedLab Pro',
      'login': 'Connexion',
      'email': 'Email',
      'password': 'Mot de passe',
      'home': 'Accueil',
      'tests': 'Mes Tests',
      'results': 'Résultats',
      'profile': 'Profil',
      'logout': 'Déconnexion',
    },
    'ar': {
      'app_name': 'ميدلاب برو',
      'login': 'تسجيل الدخول',
      'email': 'البريد الإلكتروني',
      'password': 'كلمة المرور',
      'home': 'الرئيسية',
      'tests': 'فحوصاتي',
      'results': 'النتائج',
      'profile': 'الملف الشخصي',
      'logout': 'تسجيل الخروج',
    },
  };

  static String t(String key, String locale) {
    return strings[locale]?[key] ?? strings['en']?[key] ?? key;
  }
}