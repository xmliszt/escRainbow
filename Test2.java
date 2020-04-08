import org.openqa.selenium.By;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

import com.google.common.base.Objects;

public class Test2 {
	static String myUserName = "abc@gmail.com";
	static String myPassword = "Sutd1234";
	static String myName = "Tester Lim"; 

	public static void main(String[] args) throws InterruptedException, NoAlertPresentException {
		System.setProperty("webdriver.gecko.driver", "C:\\Users\\Tiffany\\Documents\\Academic\\Term 5\\Elements of Software Construction\\geckodriver-v0.26.0-win64\\geckodriver.exe" );
		WebDriver driver = new FirefoxDriver();

		driver.get("https://alpha-holding.herokuapp.com/");
		
		WebElement settings = driver.findElement(By.id("settings"));
		settings.click();
		
		WebElement login = driver.findElement(By.id("login"));
		login.click();
		
		Thread.sleep(1000);
		
		WebElement usernameInput = driver.findElement(By.id("usernameInput"));
		
		Thread.sleep(1000);
		
		usernameInput.sendKeys(myUserName);
		
		Thread.sleep(1000);
		
		WebElement passwordInput = driver.findElement(By.id("passwordInput"));
		
		Thread.sleep(1000);
		
		passwordInput.sendKeys(myPassword);
		
		WebElement login_btn = driver.findElement(By.id("login_btn"));
		login_btn.click();
		
		Thread.sleep(4000);
		
		driver.switchTo().alert().accept();
	
		Thread.sleep(6000);
		
		WebElement nameElement = driver.findElement(By.id("titleText"));
		String name = nameElement.getText(); 
		//String name = driver.findElement(By.xpath("//*[@id = \"titleText\"]")).getAttribute("value");
		if(Objects.equal(name, myName)) {
			System.out.println("Name of user appeared"); 
		}
		else {
			System.out.println("Name of user did not appear"); 
		}
		//*[@id = "settings"]
	}
}
