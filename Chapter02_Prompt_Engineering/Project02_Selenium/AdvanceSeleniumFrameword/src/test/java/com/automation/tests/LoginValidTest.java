package com.automation.tests;

import com.automation.pages.LoginPage;
import io.github.bonigarcia.wdm.WebDriverManager;
import java.time.Duration;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

public class LoginValidTest {
    private WebDriver driver;
    private LoginPage loginPage;

    @BeforeTest
    public void setUp() {
        try {
            WebDriverManager.chromedriver().setup();
            driver = new ChromeDriver();
            driver.manage().window().maximize();
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
            loginPage = new LoginPage(driver);
        } catch (Exception e) {
            throw new RuntimeException("Test setup failed", e);
        }
    }

    @Test
    public void validLogin() {
        try {
            String username = System.getProperty("salesforce.username");
            String password = System.getProperty("salesforce.password");
            if (username == null || password == null) {
                throw new SkipException("Valid Salesforce credentials not provided");
            }
            loginPage.openLoginPage("https://login.salesforce.com/?locale=in");
            Assert.assertTrue(loginPage.isLoginPageLoaded(), "Login page did not load");
            loginPage.setRememberMe(true);
            loginPage.login(username, password);
            Assert.assertTrue(loginPage.isHomePageLoaded(), "Home page did not load after valid credentials");
        } catch (SkipException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Valid login test failed", e);
        }
    }

    @AfterTest
    public void tearDown() {
        try {
            if (driver != null) {
                driver.quit();
            }
        } catch (Exception e) {
            throw new RuntimeException("Test teardown failed", e);
        }
    }
}
