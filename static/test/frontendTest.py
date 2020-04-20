import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options


'''
# TODO1: register a test account -> test sign in
# TODO2: next to the word president has a comma, it is clickable to login with admin

test account:
email: test1@email.com
first name: test_first
last name: test_last
password: !1234567Aa
'''


class FrontendTest(unittest.TestCase):

    def setUp(self):
        # option = Options()
        # option.headless = False
        self.driver = webdriver.Chrome()
        # self.driver = webdriver.Firefox(executable_path=".\\geckodriver.exe")

    '''Supporting functions'''

    # supporting function to enter username and password
    def username_password(self, username_input, password_input):
        driver = self.driver
        driver.maximize_window()
        driver.get("http://localhost:5000/")
        DELAY = 10

        # wait till page is loaded fully and click on chat icon
        try:
            WebDriverWait(driver, DELAY).until(
                EC.presence_of_element_located((By.CLASS_NAME, 'chat-img')))
            chat = WebDriverWait(driver, DELAY).until(
                EC.invisibility_of_element_located((By.CLASS_NAME, 'chat')))
            WebDriverWait(driver, DELAY).until(
                EC.visibility_of_element_located((By.CLASS_NAME, 'toggle-chat-btn')))
            chat_icon = WebDriverWait(driver, DELAY).until(
                EC.element_to_be_clickable((By.CLASS_NAME, 'toggle-chat-btn')))

            chat_icon.click()

            print("Page is ready and chat icon is clicked!")
        except Exception as e:
            # print("Loading chat icon took too much time!")
            print(e)

        # check whether the when the chat icon is pressed, the style should change
        try:
            assert int(driver.find_elements_by_css_selector(
                '.chat')[0].value_of_css_property('opacity')) == 1
        except Exception as e:
            print(e)

        # wait till page is loaded fully, click for card replacement
        try:
            card_replacement = WebDriverWait(driver, DELAY).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="1"]')))
            print("Card replacement is ready!")
            card_replacement.click()
        except TimeoutException:
            print("Loading card replacement took too much time!")

        # wait till page is loaded fully, click for yes please
        try:
            yes_please = WebDriverWait(driver, DELAY).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="cd-0"]')))
            yes_please.click()
            print("Yes please is ready!")
        except TimeoutException:
            print("Loading yes took too much time!")

        # wait till page is loaded fully, click to sign in
        try:
            sign_in = WebDriverWait(driver, DELAY).until(
                EC.presence_of_element_located((By.XPATH, '//*[@id="resignin-5"]')))
            sign_in.click()
            print("Sign in is ready!")
        except TimeoutException:
            print("Loading sign in took too much time!")

        # enter username and password
        username = driver.find_element_by_id("usernameInput")
        password = driver.find_element_by_id("passwordInput")
        time.sleep(3)

        username.click()
        username.send_keys(username_input)
        password.click()
        password.send_keys(password_input)
        # time.sleep(3)

        driver.find_element_by_xpath('//*[@id="login_btn"]').click()
        time.sleep(3)

    # alert will pop up for those who have not registered
    def alert_register(self):
        alert = self.driver.find_element_by_xpath('//*[@id="alertLogin"]')
        # time.sleep(3)
        self.assertIsNotNone(
            self.driver.find_element_by_id('signInRegisterBtn'))

    # accept alert
    def accept_alert(self):
        alert_obj = self.driver.switch_to.alert
        # time.sleep(3)
        alert_obj.accept()
        # time.sleep(5)

    # check whether logout appears and login and signin disappears
    def logout_appears_login_disappears(self):
        # here wait for webpage to be loaded again
        driver = self.driver
        logout = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, '//*[@id="quit"]')))
        # logout = self.driver.find_element_by_xpath()
        # time.sleep(1)
        self.assertIsNotNone(logout)

        # register button should not exist
        try:
            register = self.driver.find_element_by_xpath('//*[@id="register"]')
        except NoSuchElementException:
            return False

        # login button should not exist
        try:
            login = self.driver.find_element_by_xpath('//*[@id="login"]')
        except NoSuchElementException:
            return False

    # username will appear after login
    def top_left_name(self):
        top_name = self.driver.find_element_by_xpath(
            '//*[@id="titleText"]').text
        self.assertEqual(top_name, "test_first test_last")

    # chat name should be username instead of 'Guest' when login
    def chat_name(self):
        # get icon for chat
        chat_icon = self.driver.find_element_by_xpath(
            '/html/body/div[13]/div[2]')
        chat_icon.click()
        # time.sleep(3)

        # click for card replacement
        card_replacement = self.driver.find_element_by_xpath(
            '//*[@id="1"]')
        card_replacement.click()
        # time.sleep(3)

        # check chat name
        name = self.driver.find_element_by_xpath(
            '//*[@id="conversation_body"]/div[2]/span[1]').text
        self.assertEqual(name, "test_first test_last")

    '''Testing'''

    # test
    def test_username_password1(self):
        self.username_password('test1', 'test1')
        self.alert_register()

    # test for blank string
    def test_username_password2(self):
        self.username_password('', '')

    # test for format string values
    def test_username_password3(self):
        self.username_password('%ssomething\n', '%d1234\n')
        self.alert_register()

    # test for long strings
    def test_username_password4(self):
        self.username_password('long_string'*100, 'long_string'*100)
        self.alert_register()

    def test_login1(self):
        try:
            self.username_password('test1@email.com', '!1234567Aa')
            self.accept_alert()
            self.logout_appears_login_disappears()
            self.top_left_name()
            self.chat_name()
        except Exception as e:
            print(e)

    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()
