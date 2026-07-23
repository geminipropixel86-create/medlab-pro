import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'src/providers/auth_provider.dart';
import 'src/providers/test_provider.dart';
import 'src/screens/splash_screen.dart';
import 'src/screens/login_screen.dart';
import 'src/screens/home_screen.dart';
import 'src/screens/test_detail_screen.dart';
import 'src/screens/results_screen.dart';
import 'src/screens/packages_screen.dart';
import 'src/screens/news_screen.dart';
import 'src/screens/profile_screen.dart';
import 'src/l10n/l10n.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MedLabApp());
}

class MedLabApp extends StatefulWidget {
  const MedLabApp({super.key});

  @override
  State<MedLabApp> createState() => _MedLabAppState();

  static _MedLabAppState of(BuildContext context) {
    return context.findAncestorStateOfType<_MedLabAppState>()!;
  }
}

class _MedLabAppState extends State<MedLabApp> {
  Locale _locale = const Locale('en');

  void setLocale(Locale locale) {
    setState(() => _locale = locale);
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => TestProvider()),
      ],
      child: MaterialApp(
        title: 'MedLab Pro',
        debugShowCheckedModeBanner: false,
        locale: _locale,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF6366F1),
            brightness: Brightness.light,
          ),
          useMaterial3: true,
          fontFamily: 'Roboto',
          appBarTheme: const AppBarTheme(
            centerTitle: true,
            elevation: 0,
          ),
        ),
        localizationsDelegates: const [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        supportedLocales: L10n.all,
        initialRoute: '/splash',
        routes: {
          '/splash': (ctx) => const SplashScreen(),
          '/login': (ctx) => const LoginScreen(),
          '/home': (ctx) => const HomeScreen(),
          '/profile': (ctx) => const ProfileScreen(),
          '/packages': (ctx) => const PackagesScreen(),
          '/news': (ctx) => const NewsScreen(),
        },
        onGenerateRoute: (settings) {
          if (settings.name == '/test-detail') {
            final args = settings.arguments as Map<String, dynamic>;
            return MaterialPageRoute(
              builder: (ctx) => TestDetailScreen(testId: args['testId']),
            );
          }
          if (settings.name == '/results') {
            final args = settings.arguments as Map<String, dynamic>;
            return MaterialPageRoute(
              builder: (ctx) => ResultsScreen(patientId: args['patientId']),
            );
          }
          return null;
        },
      ),
    );
  }
}