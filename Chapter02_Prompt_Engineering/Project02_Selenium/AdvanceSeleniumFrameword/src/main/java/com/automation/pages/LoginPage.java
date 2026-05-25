package com.automation.pages;

import java.time.Duration;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LoginPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(xpath = "//input[@id='username']")
    private WebElement username;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement password;

    @FindBy(xpath = "//input[@id='Login']")
    private WebElement loginButton;

    @FindBy(xpath = "//input[@id='rememberUn']")
    private WebElement rememberMeCheckbox;

    @FindBy(xpath = "//div[@id='error']")
    private WebElement errorMessage;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        PageFactory.initElements(driver, this);
    }

    public void openLoginPage(String url) {
        try {
            driver.get(url);
        } catch (Exception e) {
            throw new RuntimeException("Unable to open login page", e);
        }
    }

    public boolean isLoginPageLoaded() {
        try {
            wait.until(ExpectedConditions.visibilityOf(username));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void setUsername(String user) {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(username)).clear();
            username.sendKeys(user);
        } catch (Exception e) {
            throw new RuntimeException("Unable to enter username", e);
        }
    }

    public void setPassword(String pass) {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(password)).clear();
            password.sendKeys(pass);
        } catch (Exception e) {
            throw new RuntimeException("Unable to enter password", e);
        }
    }

    public void clickLogin() {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(loginButton)).click();
        } catch (Exception e) {
            throw new RuntimeException("Unable to click login button", e);
        }
    }

    public void setRememberMe(boolean enabled) {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(rememberMeCheckbox));
            if (rememberMeCheckbox.isSelected() != enabled) {
                rememberMeCheckbox.click();
            }
        } catch (Exception e) {
            throw new RuntimeException("Unable to update remember me", e);
        }
    }

    public void login(String user, String pass) {
        setUsername(user);
        setPassword(pass);
        clickLogin();
    }

    public String getErrorMessage() {
        try {
            return wait.until(ExpectedConditions.visibilityOf(errorMessage)).getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    public boolean isHomePageLoaded() {
        try {
            return wait.until(driver -> !driver.getCurrentUrl().contains("login.salesforce.com"));
        } catch (Exception e) {
            return false;
        }
    }
}
