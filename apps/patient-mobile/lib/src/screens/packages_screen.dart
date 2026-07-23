import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../l10n/l10n.dart';
import '../main.dart';

class PackagesScreen extends StatelessWidget {
  const PackagesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final locale = MedLabApp.of(context);
    final lang = locale._locale.languageCode;

    return Scaffold(
      appBar: AppBar(
        title: Text(L10n.t('packages', lang)),
        backgroundColor: Colors.indigo,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Package Card 1
          _buildPackageCard(context, lang, 'Basic Health Checkup', '\$49', '\$75', '35%', [
            'CBC & Lipid Profile',
            'Blood Glucose',
            'Results in 24 hours',
          ]),
          const SizedBox(height: 16),
          _buildPackageCard(context, lang, 'Comprehensive Wellness', '\$89', '\$130', '32%', [
            'Thyroid & Liver Function',
            'Kidney Profile',
            'Vitamin D Check',
          ]),
          const SizedBox(height: 16),
          _buildPackageCard(context, lang, 'Heart Health Package', '\$129', '\$185', '30%', [
            'Cardiac Enzyme Markers',
            'Advanced Lipid Panel',
            'CRP Test & ECG',
          ]),
        ],
      ),
    );
  }

  Widget _buildPackageCard(BuildContext context, String lang, String name, String price, String original, String saving, List<String> tests) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [Colors.indigo, Colors.purple]),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(L10n.t('popular', lang), style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                Text(price, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
                const SizedBox(width: 8),
                Text(original, style: const TextStyle(fontSize: 16, color: Colors.grey, decoration: TextDecoration.lineThrough)),
                const SizedBox(width: 8),
                Text(L10n.t('saving', lang).replaceAll('{percent}', saving),
                    style: const TextStyle(fontSize: 12, color: Colors.green, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 12),
            Text(L10n.t('includes', lang), style: const TextStyle(fontWeight: FontWeight.w500)),
            const SizedBox(height: 8),
            ...tests.map((t) => Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Row(children: [
                Container(width: 6, height: 6, decoration: const BoxDecoration(shape: BoxShape.circle, color: Colors.indigo)),
                const SizedBox(width: 8),
                Text(t, style: const TextStyle(fontSize: 13, color: Colors.grey)),
              ]),
            )),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.indigo,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(L10n.t('buy_now', lang)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}