import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Home }               from './pages/Home';
import { CategoryPage }       from './pages/CategoryPage';
import { PrivacyPage }        from './pages/PrivacyPage';
import { TermsPage }          from './pages/TermsPage';
import { AboutPage }          from './pages/AboutPage';
import { BlogListPage }       from './pages/blog/BlogListPage';
import { FloatingButtonPost } from './pages/blog/posts/FloatingButtonPost';
import { CookieBanner }       from './components/ui/CookieBanner';

// Text tools
import { WordCounter }        from './pages/tools/text/WordCounter';
import { CaseConverter }      from './pages/tools/text/CaseConverter';
import { WhitespaceRemover }  from './pages/tools/text/WhitespaceRemover';
import { EmailFormatter }     from './pages/tools/text/EmailFormatter';
import { ResumeFormatter }    from './pages/tools/text/ResumeFormatter';
import { MeetingFormatter }   from './pages/tools/text/MeetingFormatter';

// Datetime tools
import { DDayCalculator }     from './pages/tools/datetime/DDayCalculator';
import { WorkHoursCalculator } from './pages/tools/datetime/WorkHoursCalculator';
import { TimezoneConverter }  from './pages/tools/datetime/TimezoneConverter';
import { PTOCalculator }      from './pages/tools/datetime/PTOCalculator';

// Converter tools
import { QRGenerator }        from './pages/tools/converter/QRGenerator';
import { Base64Tool }         from './pages/tools/converter/Base64Tool';
import { ColorPalette }       from './pages/tools/converter/ColorPalette';
import { PasswordGenerator }  from './pages/tools/converter/PasswordGenerator';

// Dev tools
import { JsonFormatter }      from './pages/tools/dev/JsonFormatter';
import { EnvGenerator }       from './pages/tools/dev/EnvGenerator';
import { ReadmeBuilder }      from './pages/tools/dev/ReadmeBuilder';
import { CursorRules }        from './pages/tools/dev/CursorRules';
import { UnixTimestamp }      from './pages/tools/dev/UnixTimestamp';
import { RegexVisualizer }    from './pages/tools/dev/RegexVisualizer';

// Calculator tools
import { SalaryCalculator }   from './pages/tools/calculator/SalaryCalculator';
import { OvertimeCalculator } from './pages/tools/calculator/OvertimeCalculator';
import { RaiseCalculator }    from './pages/tools/calculator/RaiseCalculator';
import { DutchPay }           from './pages/tools/calculator/DutchPay';
import { FreelanceRate }      from './pages/tools/calculator/FreelanceRate';
import { SavingsCalculator }  from './pages/tools/calculator/SavingsCalculator';
import { LoanCalculator }     from './pages/tools/calculator/LoanCalculator';
import { BasicCalculator }    from './pages/tools/calculator/BasicCalculator';

// Converter tools (additional)
import { UnitConverter }      from './pages/tools/converter/UnitConverter';

// Games
import { LadderGame }         from './pages/tools/games/LadderGame';
import { Roulette }           from './pages/tools/games/Roulette';
import { TeamSplitter }       from './pages/tools/games/TeamSplitter';
import { LunchPicker }        from './pages/tools/games/LunchPicker';
import { LuckyDraw }          from './pages/tools/games/LuckyDraw';

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/workkit">
      <CookieBanner />
      <Routes>
        <Route path="/"                        element={<Home />} />
        <Route path="/category/:categoryId"    element={<CategoryPage />} />
        <Route path="/privacy"                 element={<PrivacyPage />} />
        <Route path="/terms"                   element={<TermsPage />} />
        <Route path="/about"                   element={<AboutPage />} />
        <Route path="/blog"                    element={<BlogListPage />} />
        <Route path="/blog/floating-button"    element={<FloatingButtonPost />} />

        {/* Text */}
        <Route path="/tools/word-counter"      element={<WordCounter />} />
        <Route path="/tools/case-converter"    element={<CaseConverter />} />
        <Route path="/tools/whitespace"        element={<WhitespaceRemover />} />
        <Route path="/tools/email-formatter"   element={<EmailFormatter />} />
        <Route path="/tools/resume-formatter"  element={<ResumeFormatter />} />
        <Route path="/tools/meeting-formatter" element={<MeetingFormatter />} />

        {/* Datetime */}
        <Route path="/tools/dday"              element={<DDayCalculator />} />
        <Route path="/tools/work-hours"        element={<WorkHoursCalculator />} />
        <Route path="/tools/timezone"          element={<TimezoneConverter />} />
        <Route path="/tools/pto"               element={<PTOCalculator />} />

        {/* Converter */}
        <Route path="/tools/qr-generator"      element={<QRGenerator />} />
        <Route path="/tools/base64"            element={<Base64Tool />} />
        <Route path="/tools/color-palette"     element={<ColorPalette />} />
        <Route path="/tools/password-gen"      element={<PasswordGenerator />} />
        <Route path="/tools/unit-converter"    element={<UnitConverter />} />

        {/* Dev */}
        <Route path="/tools/json-formatter"    element={<JsonFormatter />} />
        <Route path="/tools/env-generator"     element={<EnvGenerator />} />
        <Route path="/tools/readme-builder"    element={<ReadmeBuilder />} />
        <Route path="/tools/cursor-rules"      element={<CursorRules />} />
        <Route path="/tools/unix-timestamp"    element={<UnixTimestamp />} />
        <Route path="/tools/regex-visualizer"  element={<RegexVisualizer />} />

        {/* Calculator */}
        <Route path="/tools/salary"            element={<SalaryCalculator />} />
        <Route path="/tools/overtime"          element={<OvertimeCalculator />} />
        <Route path="/tools/raise-calc"        element={<RaiseCalculator />} />
        <Route path="/tools/dutch-pay"         element={<DutchPay />} />
        <Route path="/tools/freelance-rate"    element={<FreelanceRate />} />
        <Route path="/tools/savings-calc"      element={<SavingsCalculator />} />
        <Route path="/tools/loan-calc"         element={<LoanCalculator />} />
        <Route path="/tools/basic-calculator"  element={<BasicCalculator />} />

        {/* Games */}
        <Route path="/tools/ladder-game"       element={<LadderGame />} />
        <Route path="/tools/roulette"          element={<Roulette />} />
        <Route path="/tools/team-splitter"     element={<TeamSplitter />} />
        <Route path="/tools/lunch-picker"      element={<LunchPicker />} />
        <Route path="/tools/lucky-draw"        element={<LuckyDraw />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
