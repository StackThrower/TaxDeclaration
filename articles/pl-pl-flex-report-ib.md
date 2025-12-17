---
title: "Jak utworzyć raport 2025 Flex w Interactive Brokers"
description: "Instrukcja krok po kroku tworzenia raportu Flex dla deklaracji podatkowej w Polsce. Zbieranie niezbędnych danych do deklarowania dochodów z inwestycji."
category: "podatki"
readTime: "4 min"
publishedAt: "2025-12-17"
keywords:
  - "dochody z inwestycji polska"
  - "opodatkowanie akcji"
  - "deklaracja podatkowa"
  - "PIT-38"
---

# Instrukcja krok po kroku tworzenia raportu Flex w Interactive Brokers

Zaloguj się do konta [Interactive Brokers](https://www.interactivebrokers.co.uk/sso/Login).

Zakładka **Performance & Reports \ Flex-запити** lub pod [tym linkiem](https://www.interactivebrokers.co.uk/AccountManagement/AmAuthentication?action=Reports).

W tabeli **Activity Flex Query** klikamy +

Podajemy obowiązkową nazwę w polu **Query Name**

W tabeli **Sections** wybieramy **Cash Transaction → Dividends, Payment in Lieu of Dividends, Withholding Tax, 871(m) Withholding, Other Income, Brokers interest received, Bond Interest Paid, Bond Interest Received, Detail** i zaznaczamy **Select all → Save**.

W tabeli **Sections** wybieramy **Corporate Actions → Detail** i zaznaczamy **Select all → Save**

W tabeli **Sections** wybieramy **Grant Activity → Detail** i zaznaczamy **Select all → Save**

W tabeli **Sections** wybieramy **Trades → Closed Lots, Execution** (jeśli miałeś operacje z opcjami) i zaznaczamy **Select all → Save**

Wybieramy **Display Account Alias in Place of Account ID? → Yes**

Klikamy **Continue → Create — Ok**

Powinieneś zobaczyć wiersz z nazwą, którą podałeś wcześniej, po prawej stronie nazwy kliknij strzałkę → **Run**

W oknie dialogowym wybierz Okres → **Custom Date Range** i wskaż okres, za który planujesz wygenerować raport, zazwyczaj jest to jeden rok kalendarzowy.

W oknie dialogowym kliknij przycisk **Run** i poczekaj, aż zapytanie zostanie wygenerowane

Pobierz plik XML zapytania i przejdź do następnego kroku

